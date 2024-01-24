import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SaveAdminsUserDTO } from './dto/save-admins-user.dto';
import { AdminsUserDocument } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@ait/nestjs-base';
import { ResponseService } from '@ait/nestjs-base';
import { MessageService } from '@ait/nestjs-base';
import { SavePermissionDTO } from '../permissions/dto/save-permission.dto';
import { AuthPermissionsService } from '../permissions/auth-permissions.service';

@Injectable()
export class AdminsUsersService extends BaseService<
  SaveAdminsUserDTO,
  null,
  AdminsUserDocument
> {
  constructor(
    @InjectRepository(AdminsUserDocument)
    private readonly adminUserRepository: Repository<AdminsUserDocument>,
    private readonly authPermissionService: AuthPermissionsService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {
    super(
      adminUserRepository,
      responseService,
      messageService,
      AdminsUsersService.name,
    );

    this.relations = ['admins_users.permission'];
    this.tableAlias = 'admins_users';
    this.searchByFields = [
      'admins_users.first_name',
      'admins_users.last_name',
      'admins_users.email',
    ];
  }

  public async save(createDTO: SaveAdminsUserDTO): Promise<AdminsUserDocument> {
    const savePermission: SavePermissionDTO | undefined =
      createDTO.role?.permissions;
    if (savePermission) {
      await this.authPermissionService.save(savePermission);
    }
    return this.baseSave(createDTO);
  }

  async getAndValidateByIds(ids: string[]): Promise<AdminsUserDocument[]> {
    try {
      const existSuperAdmins = await this.repository
        .createQueryBuilder(this.tableAlias)
        .where(`${this.tableAlias}.id IN(:...ids)`, { ids })
        .getMany();
      if (existSuperAdmins.length != ids.length) {
        const existIds = existSuperAdmins.map((superAdmin) => superAdmin.id);
        const notResigterd = ids.filter((id) => !existIds.includes(id));
        this.logger.error(
          `User Admins not registered : ${notResigterd} `,
          '',
          this.constructor.name,
        );
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                `${this.tableAlias}_id`,
                'general.general.id_not_found',
              ),
            ],
            'Bad Request',
          ),
        );
      }
      return existSuperAdmins;
    } catch (error: any) {
      this.logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }
}
