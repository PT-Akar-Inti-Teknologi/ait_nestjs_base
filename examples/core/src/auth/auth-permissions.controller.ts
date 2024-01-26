import { Body, Controller, Delete, Logger, Param, Post } from '@nestjs/common';
import { AuthPermissionsService } from './auth-permissions.service';
import { PermissionDocument } from 'src/auth/entities/permission.entity';
import { SavePermissionDTO } from 'src/auth/dto/save-permission.dto';
import { DeleteResult } from 'typeorm';
import { DeletePermissionDTO } from 'src/auth/dto/delete-permission.dto';
import {
  ResponseService,
  ResponseSuccessSingleInterface,
} from '@ait/nestjs-base';

@Controller('api/v1/internal/core/auth-permissions')
export class AuthPermissionController {
  constructor(
    private readonly authPermissionsService: AuthPermissionsService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async save(
    @Body() savePermissionDTO: SavePermissionDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    try {
      const result: PermissionDocument = await this.authPermissionsService.save(
        savePermissionDTO,
      );
      return this.responseService.success(result);
    } catch (error) {
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
