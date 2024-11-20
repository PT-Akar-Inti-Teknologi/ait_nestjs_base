import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PermissionDocument } from 'src/auth/entities/permission.entity';
import { SavePermissionDTO } from 'src/auth/dto/save-permission.dto';
import { MainPagingDTO } from '@pt-akar-inti-teknologi/nestjs-base';
import { UpdatePermissionDTO } from 'src/auth/dto/update-permission.dto';
import {
  CommonService,
  MessageService,
  ResponseService,
} from '@pt-akar-inti-teknologi/nestjs-base';

@Injectable()
export class AuthPermissionsService {
  constructor(
    private readonly messageService: MessageService,
    private readonly responseService: ResponseService,
    @InjectRepository(PermissionDocument)
    private readonly permissionRepository: Repository<PermissionDocument>,
    private readonly commonService: CommonService,
  ) {}

  async save(
    createPermissionDTO: SavePermissionDTO,
  ): Promise<PermissionDocument> {
    try {
      const permissionParam: Partial<PermissionDocument> = {
        ...createPermissionDTO,
      };
      return await this.permissionRepository.save(permissionParam);
    } catch (error) {
      Logger.error(error, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async findOne(roleId: string): Promise<PermissionDocument> {
    try {
      return await this.permissionRepository
        .createQueryBuilder('permission')
        .where('permission.role_id = :roleId', { roleId: roleId })
        .getOne();
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async findAll(
    getPermissionDTO: MainPagingDTO,
  ): Promise<{ list: PermissionDocument[]; count: number }> {
    try {
      const query = this.permissionRepository.createQueryBuilder('permission');
      query.where('( permission.permissions ilike :search)', {
        search: `%${getPermissionDTO.search}%`,
      });
      if (getPermissionDTO.order && getPermissionDTO.sort) {
        let prefix = '';
        if (!getPermissionDTO.sort.includes('.')) {
          prefix = 'permission.';
        }
        query.orderBy(
          `${prefix}${getPermissionDTO.sort}`,
          getPermissionDTO.order,
        );
      } else {
        query.orderBy('permission.created_at', 'DESC');
      }
      query.take(getPermissionDTO.size);
      query.skip(getPermissionDTO.page * getPermissionDTO.size);

      const result = await query.getManyAndCount();
      return {
        list: result[0],
        count: result[1],
      };
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async update(
    roleId: string,
    updatePermissionDTO: UpdatePermissionDTO,
  ): Promise<PermissionDocument> {
    try {
      const permission = await this.getAndValidate(roleId);
      Object.assign(permission, updatePermissionDTO);
      return this.permissionRepository.save(permission);
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async remove(roleId: string): Promise<UpdateResult> {
    await this.getAndValidate(roleId);
    try {
      return await this.permissionRepository.softDelete(roleId);
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  // VALIDATION ====================================

  async getAndValidate(roleId: string): Promise<PermissionDocument> {
    try {
      const permission = await this.permissionRepository
        .createQueryBuilder('permission')
        .where('permission.role_id = :roleId', { roleId: roleId })
        .getOne();
      if (!permission) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                'role_id',
                'auth.role_id.invalid_role_id',
              ),
            ],
            'Bad Request',
          ),
        );
      }
      return permission;
    } catch (error) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async broadcastUpdate(
    createPermissionDTO: SavePermissionDTO,
  ): Promise<PermissionDocument> {
    try {
      await this.commonService.broadcastUpdate(
        createPermissionDTO,
        'auth-permissions',
      );
      const permissionParam: Partial<PermissionDocument> = {
        ...createPermissionDTO,
      };
      return this.permissionRepository.save(permissionParam);
    } catch (error) {
      Logger.error(error, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async broadcastDelete(roleId: string): Promise<UpdateResult> {
    try {
      this.commonService.broadcastDelete(roleId, 'auth-permissions');
      return this.remove(roleId);
    } catch (error) {
      Logger.error(error, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }
}
