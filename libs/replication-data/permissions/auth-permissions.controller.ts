import { Body, Controller, Delete, Logger, Param, Post } from '@nestjs/common';
import { AuthPermissionsService } from './auth-permissions.service';
import { PermissionDocument } from './entities/permission.entity';
import SavePermissionDTO from './dto/save-permission.dto';
import { DeleteResult } from 'typeorm';
import DeletePermissionDTO from './dto/delete-permission.dto';
import { ResponseService } from '../../response/response.service';
import { ResponseSuccessSingleInterface } from '../../response/response.interface';

@Controller()
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
