import {
  UseGuards,
  createParamDecorator,
  ExecutionContext,
  applyDecorators,
} from '@nestjs/common';
import { IApplyDecorator } from '../response/response.interface';
import { IUser } from './guard/interface/user.interface';
import { JwtGuard } from './guard/jwt/jwt.guard';

export function AuthJwtGuard(): IApplyDecorator {
  return applyDecorators(UseGuards(JwtGuard));
}

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const { user } = ctx.switchToHttp().getRequest();
    const response = data ? user[data] : user;
    return response as IUser;
  },
);
