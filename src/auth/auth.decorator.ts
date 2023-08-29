import {
  UseGuards,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
  Inject,
} from '@nestjs/common';
import { IUser } from './guard/interface/user.interface';
import { JwtGuard } from './guard/jwt/jwt.guard';

export function AuthJwtGuard() {
  return applyDecorators(UseGuards(JwtGuard));
}

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const { user } = ctx.switchToHttp().getRequest();
    const response = data ? user[data] : user;
    return response as IUser;
  },
);

export function Response(): (
  target: Record<string, any>,
  key: string | symbol | boolean,
  index?: number,
) => void {
  return Inject(`ResponseService`);
}

export function Message(): (
  target: Record<string, any>,
  key: string | symbol,
  index?: number,
) => void {
  return Inject(`MessageService`);
}
