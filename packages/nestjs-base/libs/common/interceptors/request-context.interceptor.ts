import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  NestMiddleware,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { IUser } from '../../auth';

const als = new AsyncLocalStorage<AitRequestContext>();

export class AitRequestContext {
  private context: ExecutionContext | undefined;

  /**
   * Static to get AitRequestContext per request anywhere
   */
  public static get currentContext() {
    return als.getStore();
  }

  public static get currentUser(): IUser | undefined {
    return this.currentContext?.context.switchToHttp().getRequest().user;
  }

  /**
   * Instance new AitRequestContext per request from middleware
   */
  constructor() {}

  /**
   * Call from interceptor before execute API
   *
   * @param request {Request} http request
   */
  public async onRequest(context: ExecutionContext) {
    this.context = context;
  }
}

@Injectable()
export class AitRequestContextInterceptor<T>
  implements NestInterceptor<T, T>, NestMiddleware<Request, Response>
{
  /**
   * Twice construct during middleware and interceptor instanced
   *
   * @param RequestContextService {RequestContextService}
   */
  constructor() {
    Logger.debug(`RequestContextInterceptor instantiated`);
  }

  /**
   * Scoped context from middleware,
   * AitRequestContext.currentContext is always individual instance per request
   *
   * @param req {Request}
   * @param res {Response}
   * @param next {void}
   */
  use(req: Request, res: Response, next: (error?: any) => void) {
    als.run(new AitRequestContext(), next);
  }

  /**
   * Global interceptor, run before and after API call
   * trigger each AitRequestContext of current context to persistence
   *
   * @param context {ExecutionContext}
   * @param next {CallHandler}
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    AitRequestContext.currentContext.onRequest(context);

    return next.handle();
  }
}
