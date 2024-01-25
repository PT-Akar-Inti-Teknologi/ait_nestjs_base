import { Injectable } from '@nestjs/common';

import { BaseEntityInternal } from './entities/base.entity';
import { EntityName } from './internal.constant';
import {
  InternalServiceBase,
  ResponseService,
  MessageService,
} from '@ait/nestjs-base';
import { DataSource } from 'typeorm';
import { ModuleRef } from '@nestjs/core';
import { MemberDocument } from './entities/member.entity';

@Injectable()
export class InternalService extends InternalServiceBase<
  BaseEntityInternal,
  EntityName
> {
  constructor(
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
    protected readonly dataSource: DataSource,
    protected readonly moduleRef: ModuleRef,
  ) {
    super(responseService, messageService, dataSource, moduleRef);
  }

  protected tablePrefix = undefined;
}
