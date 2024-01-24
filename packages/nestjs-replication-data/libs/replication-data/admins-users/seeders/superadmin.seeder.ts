import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { dataSuperAdmins } from './superadmins.data';
import { ResponseService } from '@ait/nestjs-base';
import { AdminsUserDocument } from '../entities/user.entity';

@Injectable()
export class SuperAdminSeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(AdminsUserDocument)
    public userRepository: Repository<AdminsUserDocument>,
    private readonly responseService: ResponseService,
  ) {}
  onApplicationBootstrap() {
    this.initSuperAdmins();
  }

  async initSuperAdmins(): Promise<AdminsUserDocument[]> {
    try {
      const ids = dataSuperAdmins.map((superadmin) => superadmin.id);

      const existSuperAdmins = await this.userRepository
        .createQueryBuilder()
        .where('id IN (:...ids)', { ids })
        .getMany();

      const existIds = existSuperAdmins.map((superAdmin) => superAdmin.id);

      const newSuperAdmins = dataSuperAdmins.filter(
        (item) => !existIds.includes(item.id),
      );

      const savedSuperAdmins = await this.userRepository.save(newSuperAdmins);
      Logger.debug(
        'No. of Super Admin created : ' + savedSuperAdmins.length,
        this.constructor.name,
      );
      Logger.debug(
        'Successfuly completed seeding Super Admin...',
        this.constructor.name,
      );

      return savedSuperAdmins;
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }
}
