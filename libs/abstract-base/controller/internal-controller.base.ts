import { Body, Delete, OnModuleInit, Param, Post, Put } from '@nestjs/common';
import { InternalServiceBase } from '../service/internal-service.base';
import { CommonService } from '../../common';
import { ResponseSuccessSingleInterface } from '../../response';

/**
 * Internal api to sync replication data
 * Url:
 * - save => 'api/v1/internal/loyalties/{@link EntityName}'
 * - update => 'api/v1/internal/loyalties/{@link EntityName}/{id}'
 * - delete => 'api/v1/internal/loyalties/{@link EntityName}/{id}'
 */
export abstract class InternalControllerBase<
  BaseEntityInternal extends { id: string },
  EntityName extends string,
  T extends InternalServiceBase<BaseEntityInternal, EntityName>,
> implements OnModuleInit
{
  constructor(
    protected readonly service: T,
    protected readonly commonService: CommonService,
    protected readonly entityNames: object,
  ) {}

  onModuleInit() {
    this.commonService.listenBroadcasts(
      Object.values(this.entityNames),
      'update',
      (entityName, data) => this.add(entityName as any, data as any),
    );
    this.commonService.listenBroadcasts(
      Object.values(this.entityNames),
      'delete',
      (entityName, data) => this.delete(entityName as any, data.id),
    );
  }

  @Post('/:entityName')
  public async add(
    @Param('entityName') entityName: EntityName,
    @Body() param: Partial<BaseEntityInternal>,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.service.add(entityName, param);
  }

  @Put('/:entityName/:id')
  public async update(
    @Param('entityName') entityName: EntityName,
    @Param('id') id: string,
    @Body() param: Partial<BaseEntityInternal>,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.service.update(entityName, id, param);
  }

  @Delete('/:entityName/:id')
  public async delete(
    @Param('entityName') entityName: EntityName,
    @Param('id') id: string,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.service.delete(entityName, id);
  }
}
