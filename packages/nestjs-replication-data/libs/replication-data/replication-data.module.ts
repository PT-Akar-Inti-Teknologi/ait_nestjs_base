import { DynamicModule, Module } from '@nestjs/common';
import { AdminsUsersModule } from './admins-users/admins-users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ReplicationDataConfig } from './interface/replication-data-config.interface';
import { RouterModule } from '@nestjs/core';

@Module({})
export class AitReplicationDataModule {
  static register(config: ReplicationDataConfig): DynamicModule {
    const apiPrefix = config.apiPrefix.replace(/\/$/, '');
    return {
      module: AitReplicationDataModule,
      imports: [
        PermissionsModule,
        AdminsUsersModule,
        RouterModule.register([
          {
            path: apiPrefix + '/auth-permissions',
            module: PermissionsModule,
          },
          {
            path: apiPrefix + '/admins-users',
            module: AdminsUsersModule,
          },
        ]),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
