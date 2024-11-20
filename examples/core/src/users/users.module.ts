import { EmailService } from '@ait/nest-notification';
import { HttpModule } from '@nestjs/axios';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AitAuditTrailWriterModule } from '@pt-akar-inti-teknologi/nestjs-audit-trail';
import { AuthModule } from 'src/auth/auth.module';
import { LoginModule } from 'src/login/login.module';
import { RolesDocument } from 'src/user-role/entities/roles.entity';
import { UserRolesModule } from 'src/user-role/user-roles.module';
import { UserRolesService } from 'src/user-role/user-roles.service';
import { UserDocument } from './entities/user.entity';
import { SuperAdminSeeder } from './seeders/superadmin.seeder';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([RolesDocument, UserDocument]),
    AitAuditTrailWriterModule.forFeature([UserDocument]),
    forwardRef(() => UserRolesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => LoginModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRolesService, EmailService, SuperAdminSeeder],
  exports: [UsersService, SuperAdminSeeder],
})
export class UsersModule {}
