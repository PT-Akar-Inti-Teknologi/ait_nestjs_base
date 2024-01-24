import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  OnModuleInit,
} from '@nestjs/common';
import { AdminsUsersService } from './admins-users.service';
import { CommonService, ResponseService } from '@ait/nestjs-base';
import { ResponseSuccessSingleInterface } from '@ait/nestjs-base';
import { SaveAdminsUserDTO } from './dto/save-admins-user.dto';
import { DeleteAdminsUserDTO } from './dto/delete-admins-user.dto';

@Controller()
export class AdminsUsersController implements OnModuleInit {
  constructor(
    private readonly usersService: AdminsUsersService,
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
      (entityName, data) => this.remove({ user_id: data.id }),
    );
  }

  @Post()
  async save(
    @Body() saveAdminsUserDTO: SaveAdminsUserDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    const result = await this.usersService.save(saveAdminsUserDTO);
    return this.responseService.success(result);
  }

  @Delete(':user_id')
  async remove(
    @Param() deleteUserDTO: DeleteAdminsUserDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    const deleteUser = await this.usersService.delete(deleteUserDTO.user_id);
    return this.responseService.success(deleteUser);
  }
}
