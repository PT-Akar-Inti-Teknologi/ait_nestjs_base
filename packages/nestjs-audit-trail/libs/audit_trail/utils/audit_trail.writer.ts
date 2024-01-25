import { Injectable, Type } from '@nestjs/common';
import {
  BaseSubscriber,
  Event,
  MessageService,
  ResponseService,
} from '@ait/nestjs-base';
import { DataSource, EventSubscriber, ObjectLiteral } from 'typeorm';
import { AuditTrailContext } from '../audit-trail.interceptor';

@Injectable()
@EventSubscriber()
export class AuditTrailWriter<
  E extends ObjectLiteral,
> extends BaseSubscriber<E> {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
    protected entityClass: Type<E>,
  ) {
    super(dataSource, responseService, messageService);
  }

  public listenTo(): Type<E> {
    return this.entityClass;
  }

  protected async onCommit(event: Event<E>) {
    AuditTrailContext.currentContext.logChanges({
      entityClass: this.entityClass,
      old_value: event.before,
      current_value: event.after,
    });
  }
}
