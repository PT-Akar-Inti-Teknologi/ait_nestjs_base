import { EmailService } from '@ait/nest-notification';
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RolesDocument } from 'src/user-role/entities/roles.entity';
import { UserRolesService } from 'src/user-role/user-roles.service';
import { UserDocument } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDocument, RolesDocument]),
    HttpModule,
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [LoginController],
  providers: [LoginService, UserRolesService, ConfigService, EmailService],
})
export class LoginModule {}
