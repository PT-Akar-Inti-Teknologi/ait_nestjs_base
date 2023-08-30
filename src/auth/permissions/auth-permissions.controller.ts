import { Body, Controller, Delete, Logger, Param, Post } from '@nestjs/common';

import { AuthPermissionsService } from './auth-permissions.service';
import { PermissionDocument } from './entities/permission.entity';
import { SavePermissionDTO } from './dto/save-permission.dto';
import { DeletePermissionDTO } from './dto/delete-permission.dto';
import { ResponseService } from '../../response/service/response.service';
import { ResponseSuccessSingleDTO } from '../../response/dto/response/response-success-single.dto';

@Controller(
  `api/v1/internal/${
    process.env.SERVICE_NAME?.toString().toLowerCase() ?? 'base'
  }/auth-permissions`,
)
export class AuthPermissionController {
  constructor(
    private readonly authPermissionsService: AuthPermissionsService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async save(
    @Body() savePermissionDTO: SavePermissionDTO,
  ): Promise<ResponseSuccessSingleDTO> {
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
  ): Promise<ResponseSuccessSingleDTO> {
    return this.responseService.success(
      await this.authPermissionsService.remove(deletePermissionDTO.role_id),
    );
  }
}
