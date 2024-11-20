import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseService } from '@pt-akar-inti-teknologi/nestjs-base';
import { ModuleGroupDocument } from '../entities/module-group.entity';
import { dataModuleGroups } from './module-groups.data';
import { dataModulePermissions } from './module-permissions.data';
import { ModulePermissionsDocument } from '../entities/module-permissions.entity';

@Injectable()
export class ModulePermissionSeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(ModuleGroupDocument)
    public moduleGroupRepository: Repository<ModuleGroupDocument>,
    @InjectRepository(ModulePermissionsDocument)
    public modulePermissionsRepository: Repository<ModulePermissionsDocument>,
    private readonly responseService: ResponseService,
  ) {}
  onApplicationBootstrap() {
    this.initModuleGroups();
    this.initModulePermissions();
  }

  async initModuleGroups(): Promise<ModuleGroupDocument[]> {
    try {
      const codes = dataModuleGroups.map((moduleGroup) => moduleGroup.code);

      const existModuleGroups = await this.moduleGroupRepository
        .createQueryBuilder()
        .where('code IN (:...codes)', { codes })
        .getMany();

      const existCode = existModuleGroups.map(
        (moduleGroup) => moduleGroup.code,
      );

      const newModuleGroups = dataModuleGroups.filter(
        (item) => !existCode.includes(item.code),
      );

      const savedModuleGroups = await this.moduleGroupRepository.save(
        newModuleGroups,
      );
      Logger.debug(
        'No. of Module Group created : ' + savedModuleGroups.length,
        this.constructor.name,
      );
      Logger.debug(
        'Successfuly completed seeding Module Group...',
        this.constructor.name,
      );

      return savedModuleGroups;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }
  async initModulePermissions(): Promise<ModulePermissionsDocument[]> {
    try {
      const combination = dataModulePermissions.map(
        (permission) =>
          permission.id +
          permission.code +
          permission.group_code +
          permission.sequence,
      );

      const existModulePermissions = await this.modulePermissionsRepository
        .createQueryBuilder()
        .where('id || code || group_code || sequence IN (:...combination)', {
          combination,
        })
        .getMany();

      const existIds = existModulePermissions.map(
        (modulePermission) => modulePermission.id,
      );

      const newModulePermissions = dataModulePermissions.filter(
        (item) => !existIds.includes(item.id),
      );

      const savedModulePermissions =
        await this.modulePermissionsRepository.save(newModulePermissions);
      Logger.debug(
        'No. of Module Permission created : ' + savedModulePermissions.length,
        this.constructor.name,
      );
      Logger.debug(
        'Successfuly completed seeding Module Permission...',
        this.constructor.name,
      );

      return savedModulePermissions;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }
}
