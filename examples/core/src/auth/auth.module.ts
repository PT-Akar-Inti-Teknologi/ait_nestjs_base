import { Module } from '@nestjs/common';
import { AuthPermissionController } from './auth-permissions.controller';
import { JwtStrategy } from './guard/jwt/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionDocument } from './entities/permission.entity';
import { AuthPermissionsService } from './auth-permissions.service';
import { AitAuthModule } from '@ait/nestjs-base';

@Module({
  imports: [
    AitAuthModule.register({
      jwtSecretKey: process.env.AUTH_JWTSECRETKEY,
      jwtExpirationTime: process.env.AUTH_JWTEXPIRATIONTIME,
      refreshJwtExpirationTime: process.env.AUTH_REFRESHJWTEXPIRATIONTIME,
      jwtStrategy: {
        strategy: JwtStrategy,
        imports: [TypeOrmModule.forFeature([PermissionDocument])],
        providers: [AuthPermissionsService],
        exports: [AuthPermissionsService],
      },
    }),
  ],
  controllers: [AuthPermissionController],
})
export class AuthModule {}
