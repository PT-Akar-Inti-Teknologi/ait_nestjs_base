import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { AitBaseEntity } from '../../abstract-base/entities/entity.base';
import { MessageService } from '../../message/message.service';
import { ResponseService } from '../../response/response.service';
import { AitRequestContext } from '../interceptors/request-context.interceptor';

@Injectable()
@EventSubscriber()
export class AitAutoLogSubscriber implements EntitySubscriberInterface {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return AitBaseEntity;
  }

  beforeInsert(event: InsertEvent<any>): void | Promise<any> {
    const entity: AitBaseEntity = event.entity;
    if (!entity) return;
    entity.created_by_id = AitRequestContext.currentUser?.id;
  }

  beforeUpdate(event: UpdateEvent<any>): void | Promise<any> {
    const entity: AitBaseEntity = event.entity as AitBaseEntity;
    if (!entity) return;
    entity.updated_by_id = AitRequestContext.currentUser?.id;
  }

  beforeSoftRemove(event: SoftRemoveEvent<any>): void | Promise<any> {
    event.manager.update(
      event.metadata.target,
      {
        id: event.entity.id,
      },
      {
        deleted_by_id: AitRequestContext.currentUser?.id,
      },
    );
  }
}
