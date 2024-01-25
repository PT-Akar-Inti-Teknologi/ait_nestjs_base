import { Module, forwardRef } from '@nestjs/common';
import { UserRolesController } from './user-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRolesService } from './user-roles.service';
import { ModulePermissionsDocument } from './entities/module-permissions.entity';
import { RoleModulePermissionsDocument } from './entities/role-module-permissions.entity';
import { RolesDocument } from './entities/roles.entity';
import { ModulesService } from './modules.service';
import { ModuleGroupDocument } from './entities/module-group.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ModulePermissionSeeder } from './seeders/module-permission.seeder';
import { UserDocument } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RolesDocument,
      RoleModulePermissionsDocument,
      ModulePermissionsDocument,
      ModuleGroupDocument,
      UserDocument,
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => UserRolesModule),
  ],
  controllers: [UserRolesController],
  providers: [ModulesService, ModulePermissionSeeder, UserRolesService],
  exports: [UserRolesService, ModulePermissionSeeder],
})
export class UserRolesModule {}
