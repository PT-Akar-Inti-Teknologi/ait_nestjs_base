import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EventSubscriber } from 'typeorm';

import {
  MessageService,
  ResponseService,
  BaseSubscriber,
  Event,
  BaseSubscriberEventType,
} from '@pt-akar-inti-teknologi/nestjs-base';

import { MemberDocument } from '../entities/member.entity';

@Injectable()
@EventSubscriber()
export class MemberDocumentSubscriber extends BaseSubscriber<MemberDocument> {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
  ) {
    super(dataSource, responseService, messageService);
  }

  public listenTo() {
    return MemberDocument;
  }

  protected async onCommit(event: Event<MemberDocument>) {
    if (event.type === BaseSubscriberEventType.INSERT) {
      Logger.log('INSERTING member');
    }
  }
}
