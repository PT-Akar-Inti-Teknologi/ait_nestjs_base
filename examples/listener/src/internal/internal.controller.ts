import { Controller } from '@nestjs/common';

import { InternalService } from './internal.service';
import { BASE_PATH, EntityName } from './internal.constant';
import { BaseEntityInternal } from './entities/base.entity';
import { CommonService, InternalControllerBase } from '@ait/nestjs-base';

/**
 * Internal api to sync replication data
 * Url:
 * - save => 'api/v1/internal/listener/{@link EntityName}'
 * - update => 'api/v1/internal/listener/{@link EntityName}/{id}'
 * - delete => 'api/v1/internal/listener/{@link EntityName}/{id}'
 */
@Controller(BASE_PATH)
export class InternalController extends InternalControllerBase<
  BaseEntityInternal,
  EntityName,
  InternalService
> {
  constructor(
    protected readonly service: InternalService,
    protected readonly commonService: CommonService,
  ) {
    super(service, commonService, EntityName);
  }
}
