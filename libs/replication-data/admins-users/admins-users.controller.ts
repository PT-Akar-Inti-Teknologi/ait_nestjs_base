import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { AdminsUsersService } from './admins-users.service';
import { ResponseService } from '../../response/response.service';
import { ResponseSuccessSingleInterface } from '../../response/response.interface';
import { SaveAdminsUserDTO } from './dto/save-admins-user.dto';
import { DeleteAdminsUserDTO } from './dto/delete-admins-user.dto';

@Controller()
export class AdminsUsersController {
  constructor(
    private readonly usersService: AdminsUsersService,
    private readonly responseService: ResponseService,
  ) {}

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
