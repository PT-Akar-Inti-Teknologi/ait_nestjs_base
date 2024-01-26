import {
  Body,
  Controller,
  Delete,
  Logger,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { AuthPermissionsService } from './auth-permissions.service';
import { PermissionDocument } from './entities/permission.entity';
import { SavePermissionDTO } from './dto/save-permission.dto';
import { DeleteResult } from 'typeorm';
import { DeletePermissionDTO } from './dto/delete-permission.dto';
import {
  CommonService,
  ResponseService,
  ResponseSuccessSingleInterface,
} from '@ait/nestjs-base';

@Controller()
export class AuthPermissionController implements OnModuleInit {
  constructor(
    private readonly authPermissionsService: AuthPermissionsService,
    private readonly responseService: ResponseService,
    private readonly commonService: CommonService,
  ) {}

  onModuleInit() {
    this.commonService.listenBroadcasts(
      ['admins-users'],
      'update',
      (entityName, data) => this.save(data as any),
    );
    this.commonService.listenBroadcasts(
      ['admins-users'],
      'delete',
      (entityName, data) => this.delete({ role_id: data.id }),
    );
  }

  @Post()
  async save(
    @Body() savePermissionDTO: SavePermissionDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    try {
      const result: PermissionDocument = await this.authPermissionsService.save(
        savePermissionDTO,
      );
      return this.responseService.success(result);
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  @Delete('/:role_id')
  async delete(
    @Param() deletePermissionDTO: DeletePermissionDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    const result: DeleteResult = await this.authPermissionsService.remove(
      deletePermissionDTO.role_id,
    );

    return this.responseService.success(result);
  }
}
