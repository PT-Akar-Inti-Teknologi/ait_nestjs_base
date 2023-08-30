import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ResponseService } from '../response/service/response.service';
import { MessageService } from '../response/service/message.service';

import { JwtStrategy } from './guard/jwt/jwt.strategy';
import { HashService } from '../hash/hash.service';

import { AuthPermissionController } from './permissions/auth-permissions.controller';
import { AuthPermissionsService } from './permissions/auth-permissions.service';
import { PermissionDocument } from './permissions/entities/permission.entity';

interface AuthOptions {
  enableAuthPermissionController?: boolean;
}

@Module({})
export class AuthModule {
  public static forRoot(options: AuthOptions): DynamicModule {
    const module: DynamicModule = {
      global: true,
      module: AuthModule,
      imports: [
        HttpModule,
        ConfigModule.forRoot(),
        JwtModule.registerAsync({
          inject: [ConfigService],
          imports: [ConfigModule],
          useFactory: () => {
            return {
              secret: process.env.AUTH_JWTSECRETKEY,
              signOptions: {
                expiresIn: process.env.AUTH_JWTEXPIRATIONTIME,
              },
            };
          },
        }),
        TypeOrmModule.forFeature([PermissionDocument]),
      ],
      providers: [
        MessageService,
        ResponseService,
        HashService,
        ConfigService,
        ConfigModule,
        JwtStrategy,
        AuthPermissionsService,
      ],
    };

    if (options.enableAuthPermissionController) {
      module.controllers = [AuthPermissionController];
    }

    module.exports = module.providers;

    return module;
  }
}
