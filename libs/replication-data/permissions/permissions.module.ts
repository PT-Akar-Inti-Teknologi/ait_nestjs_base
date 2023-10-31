import { Module } from '@nestjs/common';
import { AuthPermissionController } from './auth-permissions.controller';
import { AuthPermissionsService } from './auth-permissions.service';
import { ResponseService } from '../../response/response.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionDocument } from './entities/permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionDocument])],
  controllers: [AuthPermissionController],
  providers: [AuthPermissionsService, ResponseService],
  exports: [AuthPermissionsService],
})
export class PermissionsModule {}
