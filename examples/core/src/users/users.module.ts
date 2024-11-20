import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { UserRolesService } from 'src/user-role/user-roles.service';
import { UserRolesModule } from 'src/user-role/user-roles.module';
import { RolesDocument } from 'src/user-role/entities/roles.entity';
import { EmailService } from '@pt-akar-inti-teknologi/nest-notification';
import { UserDocument } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { SuperAdminSeeder } from './seeders/superadmin.seeder';
import { LoginModule } from 'src/login/login.module';
import { AitAuditTrailWriterModule } from '@pt-akar-inti-teknologi/nestjs-audit-trail';

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
