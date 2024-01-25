import { forwardRef, Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { UserDocument } from 'src/users/entities/user.entity';
import { RolesDocument } from 'src/user-role/entities/roles.entity';
import { UserRolesService } from 'src/user-role/user-roles.service';
import { EmailService } from '@ait/nest-notification';
import { UsersModule } from 'src/users/users.module';

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
