import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Scope,
  forwardRef,
} from '@nestjs/common';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseService, MessageService, BaseService } from '@pt-akar-inti-teknologi/nestjs-base';
import { RolesDocument } from './entities/roles.entity';
import { UpdateUserRolesDTO } from './dto/update-user-roles.dto';
import { SavePermissionDTO } from 'src/auth/dto/save-permission.dto';
import { AuthPermissionsService } from 'src/auth/auth-permissions.service';
import { PermissionDocument } from 'src/auth/entities/permission.entity';
import { CreateUserRolesDTO } from './dto/create-user-roles.dto';
import { GetUserRolesDTO } from './dto/get-user-roles.dto';
import { UsersService } from 'src/users/users.service';
import { GetUserDTO } from 'src/users/dto/get-user.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserRolesService extends BaseService<
  CreateUserRolesDTO,
  UpdateUserRolesDTO,
  RolesDocument,
  GetUserRolesDTO
> {
  constructor(
    @InjectRepository(RolesDocument)
    public repository: Repository<RolesDocument>,
    // @InjectRepository(RoleModulePermissionsDocument)
    // private readonly roleModulePermissionsRepository: Repository<RoleModulePermissionsDocument>,
    @Inject(forwardRef(() => AuthPermissionsService))
    private readonly authPermissionService: AuthPermissionsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
  ) {
    super(repository, responseService, messageService, UserRolesService.name);

    this.tableAlias = 'roles';

    this.relations = [
      'roles_module_permissions',
      'roles_module_permissions.module_permission',
      'roles_module_permissions.module_permission.group',
    ];
  }

  async save(createUserRolesDTO: CreateUserRolesDTO): Promise<RolesDocument> {
    try {
      const saved = await super.save(createUserRolesDTO);
      const roleDetail = await this.getAndValidateById(saved.id);
      this.savePermission(roleDetail);
      return roleDetail;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async update(
    updateRoleDTO: UpdateUserRolesDTO,
    roleId: string,
  ): Promise<RolesDocument> {
    try {
      const update = await super.update(updateRoleDTO, roleId);
      this.savePermission(update);
      return update;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async savePermission(roleDetail: RolesDocument): Promise<PermissionDocument> {
    const rolePermission: SavePermissionDTO = {
      role_id: roleDetail.id,
      permissions: [],
    };
    for (const roleModulePermission of roleDetail.roles_module_permissions) {
      for (const activePermission of roleModulePermission.active_permissions) {
        const permission = `${roleModulePermission.module_permission.code}.${activePermission}`;
        rolePermission.permissions.push(permission);
      }
    }
    return this.authPermissionService.broadcastUpdate(rolePermission);
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      const paramUser: GetUserDTO = {
        role_ids: [id],
        is_active: undefined,
        page: 0,
        size: 10,
        search: null,
        sort: null,
        order: null,
      };
      const listUser = await this.usersService.findAll(paramUser);
      if (listUser.count > 0) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                'user',
                'user_role.role.in_use',
              ),
            ],
            'Bad Request',
          ),
        );
      }
      const result = await super.delete(id);
      this.authPermissionService.broadcastDelete(id);
      return result;
    } catch (error) {
      this.logger.error(error.message);
      this.responseService.throwError(error);
    }
  }
}
