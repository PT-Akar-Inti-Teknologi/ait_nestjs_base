import { BadRequestException, HttpStatus } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EntityTarget,
  ObjectLiteral,
  TransactionCommitEvent,
} from 'typeorm';

import { MessageService } from '../../message/message.service';
import { ResponseService } from '../../response/response.service';
import { ResponseSuccessSingleInterface } from '../../response/response.interface';

export enum EventType {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
  SOFT_REMOVE = 'SOFT_REMOVE',
  DELETE = 'DELETE',
  SOFT_DELETE = 'SOFT_DELETE',
}

const defaultSubscriberEvents = [
  EventType.INSERT,
  EventType.UPDATE,
  EventType.DELETE,
  EventType.SOFT_DELETE,
];

const baseSubscriberEventExecutor = {
  [EventType.INSERT]: 'onCommit',
  [EventType.UPDATE]: 'onCommit',
  [EventType.REMOVE]: 'onCommit',
  [EventType.SOFT_REMOVE]: 'onCommit',
  [EventType.DELETE]: 'afterRemove',
  [EventType.SOFT_DELETE]: 'afterSoftRemove',
};

const baseSubscriberEventListener = {
  [EventType.INSERT]: 'beforeInsert',
  [EventType.UPDATE]: 'beforeUpdate',
  [EventType.REMOVE]: 'beforeRemove',
  [EventType.SOFT_REMOVE]: 'beforeSoftRemove',
  [EventType.DELETE]: 'beforeRemove',
  [EventType.SOFT_DELETE]: 'beforeSoftRemove',
};

export interface Event<E> {
  type: EventType;
  before: E;
  after: E;
}

export interface BaseSubscriberOptions {
  supportedTypes?: EventType[];
}

export abstract class BaseSubscriber<E extends ObjectLiteral>
  implements EntitySubscriberInterface<E>
{
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
    protected readonly options: BaseSubscriberOptions = {},
  ) {
    this.options.supportedTypes =
      this.options.supportedTypes || defaultSubscriberEvents;
    dataSource.subscribers.push(this);

    this.proxy();
  }

  async publisher(e: any, executorName: string) {
    if (
      typeof e.queryRunner === 'object' &&
      e.queryRunner.type &&
      baseSubscriberEventExecutor[e.queryRunner.type] == executorName &&
      e.queryRunner.target == this.listenTo() &&
      typeof e.queryRunner.action === 'function'
    ) {
      await this.onCommit(await e.queryRunner.action());
    }
  }

  afterTransactionCommit(event: TransactionCommitEvent): void | Promise<any> {
    this.publisher(event, 'afterTransactionCommit');
  }

  afterSoftRemove(event: TransactionCommitEvent): void | Promise<any> {
    this.publisher(event, 'afterSoftRemove');
  }

  afterRemove(event: TransactionCommitEvent): void | Promise<any> {
    this.publisher(event, 'afterRemove');
  }

  /**
   * Dynamic proxy build event from typeorm to internal event
   *
   * @param publisher {string}
   * @param subscriber {string}
   * @private {void}
   */
  private proxy() {
    this.options.supportedTypes.forEach((type) => {
      this[baseSubscriberEventListener[type]] = async (e: any) => {
        const event = {
          type,
          before: null,
          after: null,
        };

        if (e.databaseEntity) {
          event.before = await this.findDetail<E>(
            this.listenTo(),
            e.databaseEntity.id,
          );
        }

        e.queryRunner = {
          type,
          target: this.listenTo(),
          action: async () => {
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
  protected findDetail<D>(
    target: EntityTarget<D>,
    id: string,
    withDeleted = false,
  ): Promise<D> {
    return this.dataSource.createEntityManager().findOne(target, {
      where: { id } as any,
      withDeleted: withDeleted,
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
