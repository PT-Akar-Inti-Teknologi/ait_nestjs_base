import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import {
  AuthJwtGuard,
  IUser,
  PaginationInterface,
  Permission,
  ResponseService,
  ResponseSuccessSingleInterface,
  User,
} from '@ait/nestjs-base';
import { GetUserDTO } from './dto/get-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { VerificationTokenDTO } from './dto/verification-token.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';

@Controller('api/v1/core/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly responseService: ResponseService,
  ) {}

  @Post('verification-token')
  async verificationToken(
    @Body() verificationTokenDTO: VerificationTokenDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    const result = await this.usersService.validationToken(
      verificationTokenDTO,
    );
    return this.responseService.success({ token: result.token });
  }

  @Post('reset-password')
  @AuthJwtGuard()
  async resetPassword(
    @Body() resetPasswordDTO: ResetPasswordDTO,
    @User() user: IUser,
  ): Promise<ResponseSuccessSingleInterface> {
    const result = await this.usersService.resetPassword(
      resetPasswordDTO,
      user.id,
    );
    return this.responseService.success(result);
  }

  @Post()
  @Permission('user.create')
  @AuthJwtGuard()
  async create(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    const result = await this.usersService.create(createUserDTO);
    return this.responseService.success(result);
  }

  @Get()
  @Permission('user.read')
  @AuthJwtGuard()
  async findAll(@Query() getUserDTO: GetUserDTO): Promise<any> {
    const users = await this.usersService.findAll(getUserDTO);
    const pagination: PaginationInterface = {
      page: getUserDTO.page,
      total: users.count,
      size: getUserDTO.size,
    };
    return this.responseService.successCollection(users.list, pagination);
  }

  @Get('my-profile')
  @AuthJwtGuard()
  async myProfile(@User() user: IUser) {
    const profile = await this.usersService.myProfile(user.id);
    return this.responseService.success(profile);
  }

  @Get(':user_id')
  @Permission('user.read')
  @AuthJwtGuard()
  async findOne(
    @Param('user_id') userId: string,
  ): Promise<ResponseSuccessSingleInterface> {
    const result = await this.usersService.getAndValidate(userId);
    return this.responseService.success(result);
  }

  @Put(':user_id')
  @Permission('user.update')
  @AuthJwtGuard()
  async update(
    @Param('user_id') userId: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ) {
    const result = await this.usersService.update(userId, updateUserDTO);
    return this.responseService.success(result);
  }

  @Delete(':user_id')
  @Permission('user.delete')
  @AuthJwtGuard()
  async remove(
    @Param('user_id') userId: string,
    @Body() deleteUserDTO: DeleteUserDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    const deleteUser = await this.usersService.remove(userId, deleteUserDTO);
    return this.responseService.success(deleteUser);
  }

  @Post(':user_id/resend-verification-link')
  @Permission('user.create')
  @AuthJwtGuard()
  async resendVerificationLink(
    @Param('user_id') userId: string,
  ): Promise<ResponseSuccessSingleInterface> {
    const result = await this.usersService.sendVerificationLink(userId);
    return this.responseService.success(result);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDTO: ForgotPasswordDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    const result = await this.usersService.forgotPassword(forgotPasswordDTO);
    return this.responseService.success(result);
  }
}
