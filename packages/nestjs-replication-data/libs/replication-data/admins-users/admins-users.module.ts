import { Module } from '@nestjs/common';
import { AdminsUsersService } from './admins-users.service';
import { AdminsUsersController } from './admins-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AdminsUserDocument } from './entities/user.entity';
import { SuperAdminSeeder } from './seeders/superadmin.seeder';
import { PermissionDocument } from '../permissions/entities/permission.entity';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([AdminsUserDocument, PermissionDocument]),
    PermissionsModule,
  ],
  controllers: [AdminsUsersController],
  providers: [AdminsUsersService, SuperAdminSeeder],
  exports: [AdminsUsersService, SuperAdminSeeder],
})
export class AdminsUsersModule {}
