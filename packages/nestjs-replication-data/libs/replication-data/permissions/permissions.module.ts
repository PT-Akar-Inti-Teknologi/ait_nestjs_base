import { Module } from '@nestjs/common';
import { AuthPermissionController } from './auth-permissions.controller';
import { AuthPermissionsService } from './auth-permissions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionDocument } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionDocument])],
  controllers: [AuthPermissionController],
  providers: [AuthPermissionsService],
  exports: [AuthPermissionsService],
})
export class PermissionsModule {}
