import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { IApplyDecorator } from '../response/response.interface';
import { IUser } from './guard/interface/user.interface';
import { JwtGuardV2 } from './guard/jwt/jwt-v2.guard';
import { JwtGuard } from './guard/jwt/jwt.guard';
import { RefreshJwtGuard } from './guard/jwt/refresh-jwt.guard';

export function AuthJwtGuard(): IApplyDecorator {
  return applyDecorators(UseGuards(JwtGuard));
}

export function AuthJwtGuardV2(): IApplyDecorator {
  return applyDecorators(UseGuards(JwtGuardV2));
}

export function AuthRefreshJwtGuard(): IApplyDecorator {
  return applyDecorators(UseGuards(RefreshJwtGuard));
}

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext): Record<string, any> => {
    const { user } = ctx.switchToHttp().getRequest();
    const response = data ? user[data] : user;
    return response as IUser;
  },
);
