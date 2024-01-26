import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuditTrailService } from './audit_trail.service';
import {
  AuditTrail,
  AuditTrailChanges,
  AuditTrailManualChange,
} from './entities/audit_trail_request.entity';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import moment from 'moment';
import { DataSource } from 'typeorm';

const als = new AsyncLocalStorage<AuditTrailContext>();

export class AuditTrailContext {
  private readonly auditTrail: AuditTrail;

  /**
   * Static to get AuditTrailContext per request anywhere
   */
  public static get currentContext() {
    return als.getStore();
  }

  /**
   * Instance new AuditTrailContext per request from middleware
   *
   * @param auditTrailService {AuditTrailService} forwarded injected service
   */
  constructor(
    private readonly auditTrailService: AuditTrailService,
    private readonly dataSource: DataSource,
  ) {
    this.auditTrail = new AuditTrail();
    this.auditTrail.request_id = randomUUID();
    this.auditTrail.changes = [];

    Logger.debug(
      `AuditTrailContext instantiated ${this.auditTrail.request_id}`,
    );
  }

  /**
   * Call from interceptor before execute API
   *
   * @param request {Request} http request
   */
  public async onRequest(request: Request) {
    if (request.header('authorization')) {
      const auth = request
        .header('authorization')
        .replace('Bearer ', '')
        .split('.')[1];
      let user: any = Buffer.from(auth, 'base64').toString('utf8');
      user = JSON.parse(user);
      this.auditTrail.created_by = user.id ?? 'undefined';
    }
    this.auditTrail.user_action = request.header('cms-user-action') ?? null;
    this.auditTrail.menu = request.header('cms-menu') ?? null;
    this.auditTrail.request = {
      body: request.body,
      query: request.query,
    };
  }

  /**
   * Call from Subscriber after commit transaction. automatically called when
   * repository calls save or softRemove.
   *
   * @param changes {AuditTrailChanges} formatted AuditTrailChanges
   */
  public onCommit(changes: AuditTrailChanges) {
    this.auditTrail.changes.push(changes);
  }

  /**
   * Manually log changes when not using specified functions
   *
   * @param changes {AuditTrailManualChange[]} formatted AuditTrailChanges
   */
  public logChanges(...changes: AuditTrailManualChange[]) {
    this.auditTrail.changes.push(
      ...changes.map(({ entityClass, old_value, current_value }) =>
        Object.assign(
          {
            table: this.dataSource.getMetadata(entityClass).givenTableName,
            old_value,
            current_value,
            created_at: new Date(),
          },
          new AuditTrailChanges(),
        ),
      ),
    );
  }

  /**
   * Call from interceptor after execute API
   *
   * @param data {Object} response from service
   */
  public onResponse<T>(data: T) {
    if (this.auditTrail.changes.length) {
      this.auditTrail.response = data;
      this.auditTrail.created_at = new Date();
      this.auditTrail.expired_at = moment()
        .add(process.env.AUDIT_TRAIL_EXPIRATION_DAYS, 'days')
        .toDate();
      this.auditTrailService.save(this.auditTrail);
    }
  }
}

@Injectable()
export class AuditTrailInterceptor<T>
  implements NestInterceptor<T, T>, NestMiddleware<Request, Response>
{
  /**
   * Twice construct during middleware and interceptor instanced
   *
   * @param auditTrailService {AuditTrailService}
   */
  constructor(
    private readonly auditTrailService: AuditTrailService,
    protected readonly dataSource: DataSource,
  ) {
    Logger.debug(`AuditTrailInterceptor instantiated`);
  }

  /**
   * Scoped context from middleware,
   * AuditTrailContext.currentContext is always individual instance per request
   *
   * @param req {Request}
   * @param res {Response}
   * @param next {void}
   */
  use(req: Request, res: Response, next: (error?: any) => void) {
    als.run(
      new AuditTrailContext(this.auditTrailService, this.dataSource),
      next,
    );
  }

  /**
   * Global interceptor, run before and after API call
   * trigger each AuditTrailContext of current context to persistence
   *
   * @param context {ExecutionContext}
   * @param next {CallHandler}
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    AuditTrailContext.currentContext.onRequest(
      context.switchToHttp().getRequest(),
    );

    return next.handle().pipe(
      map((data: T) => {
        AuditTrailContext.currentContext.onResponse(data);

        return data;
      }),
    );
  }
}
