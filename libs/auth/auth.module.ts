import { Module, DynamicModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guard/jwt/jwt.strategy';
import { ResponseService } from '../response/response.service';
import { AuthPermissionsService } from '../replication-data/permissions/auth-permissions.service';
import { PermissionDocument } from '../replication-data/permissions/entities/permission.entity';
import { AitAuthConfig } from './guard/interface/auth-config.interface';

@Module({})
export class AitAuthModule {
  static register(config: AitAuthConfig): DynamicModule {
    return {
      module: AitAuthModule,
      imports: [
        TypeOrmModule.forFeature([PermissionDocument]),
        HttpModule,
        JwtModule.register({
          secret: config.jwtSecretKey,
          signOptions: {
            expiresIn: config.jwtExpirationTime,
          },
        }),
      ],
      controllers: [],
      exports: [AuthService],
      providers: [
        {
          provide: AitAuthConfig,
          useValue: config,
        },
        AuthService,
        ResponseService,
        JwtStrategy,
        ConfigService,
        ConfigModule,
        AuthPermissionsService,
      ],
    };
  }
}
