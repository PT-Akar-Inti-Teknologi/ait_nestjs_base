import { Controller, Post, Body, Logger } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDTO } from './dto/login.dto';
import {
  AuthJwtGuard,
  ResponseService,
  ResponseStatusCode,
  ResponseSuccessSingleInterface,
  User,
  UserType,
} from '@ait/nestjs-base';

@Controller('api/v1/core/login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly responseService: ResponseService,
  ) {}

  logger = new Logger();

  @Post('email')
  @ResponseStatusCode()
  async loginByEmail(
    @Body() params: LoginDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    const result = await this.loginService.loginByEmail(params);

    return this.responseService.success(result);
  }

  @Post('refresh-token')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async refreshToken(
    @User() user: any,
  ): Promise<ResponseSuccessSingleInterface> {
    delete user.iat;
    delete user.exp;
    const token = await this.loginService.refreshToken(user);
    const result = {
      token,
    };

    return this.responseService.success(result);
  }
}
