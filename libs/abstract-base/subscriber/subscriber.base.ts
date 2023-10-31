import { BadRequestException, HttpStatus } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EntityTarget,
  ObjectLiteral,
} from 'typeorm';

import { MessageService } from '../../message/message.service';
import { ResponseService } from '../../response/response.service';
import { ResponseSuccessSingleInterface } from '../../response/response.interface';

export enum EventType {
  INSERT = 'beforeInsert',
  UPDATE = 'beforeUpdate',
  DELETE = 'beforeRemove',
}

export interface Event<E> {
  type: EventType;
  before: E;
  after: E;
}

export abstract class BaseSubscriber<E extends ObjectLiteral>
  implements EntitySubscriberInterface<E>
{
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
  ) {
    dataSource.subscribers.push(this);

    this.proxy('afterTransactionCommit', 'onCommit');
  }

  /**
   * Dynamic proxy build event from typeorm to internal event
   *
   * @param publisher {string}
   * @param subscriber {string}
   * @private {void}
   */
  private proxy(publisher: string, subscriber: string) {
    this[publisher] = async (e: any) => {
      if (
        typeof e.queryRunner[subscriber] === 'object' &&
        e.queryRunner[subscriber].target == this.listenTo() &&
        typeof e.queryRunner[subscriber][subscriber] === 'function' &&
        typeof this[subscriber] === 'function'
      ) {
        await this[subscriber](await e.queryRunner[subscriber][subscriber]());
      }
    };

    Object.keys(EventType).forEach((type) => {
      this[EventType[type]] = async (e: any) => {
        const event = { type: EventType[type], before: null, after: null };

        if (e.databaseEntity) {
          event.before = await this.findDetail<E>(
            this.listenTo(),
            e.databaseEntity.id,
          );
        }

        e.queryRunner[subscriber] = {
          target: this.listenTo(),
          [subscriber]: async () => {
            event.after = await this.findDetail<E>(
              this.listenTo(),
              e.entity.id,
            );

            return event;
          },
        };
      };
    });
  }

  public abstract listenTo();

  protected abstract onCommit(event: Event<E>): Promise<any>;

  /**
   * Function to find detail by id and load all relations
   *
   * @param target {Object | Function} of {E}
   * @param id {string}
   * @protected
   */
  protected findDetail<D>(target: EntityTarget<D>, id: string): Promise<D> {
    return this.dataSource.createEntityManager().findOne(target, {
      where: { id } as any,
      relations: this.dataSource
        .getMetadata(target)
        .ownRelations.slice(0)
        .map((r) => r.propertyName),
    });
  }

  /**
   * Function to disable end point of CRUD
   *
   * @private
   */
  protected notImplemented(): Promise<ResponseSuccessSingleInterface> {
    throw new BadRequestException(
      this.responseService.error(
        HttpStatus.BAD_REQUEST,
        [
          this.messageService.getErrorMessage(
            'date',
            'general.general.data_not_allowed',
          ),
        ],
        'Bad Request',
      ),
    );
  }
}
