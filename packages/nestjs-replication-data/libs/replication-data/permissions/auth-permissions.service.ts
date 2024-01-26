import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PermissionDocument } from './entities/permission.entity';
import { UpdatePermissionDTO } from './dto/update-permission.dto';
import { SavePermissionDTO } from './dto/save-permission.dto';
import { MessageService } from '@ait/nestjs-base';
import { ResponseService } from '@ait/nestjs-base';
import { MainPagingDTO } from '@ait/nestjs-base';

@Injectable()
export class AuthPermissionsService {
  constructor(
    @InjectRepository(PermissionDocument)
    private readonly permissionRepository: Repository<PermissionDocument>,
    private readonly messageService: MessageService,
    private readonly responseService: ResponseService,
  ) {}

  async save(
    savePermissionDTO: SavePermissionDTO,
  ): Promise<PermissionDocument> {
    try {
      const permissionParam: Partial<PermissionDocument> = {
        ...savePermissionDTO,
      };
      return await this.permissionRepository.save(permissionParam);
    } catch (error: any) {
      Logger.error(error, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async findOne(roleId: string): Promise<PermissionDocument> {
    try {
      return this.permissionRepository
        .createQueryBuilder('permission')
        .where('permission.role_id = :roleId', { roleId: roleId })
        .getOne();
    } catch (error: any) {
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
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async update(roleId: string, updatePermissionDTO: UpdatePermissionDTO) {
    try {
      const permission = await this.getAndValidate(roleId);
      Object.assign(permission, updatePermissionDTO);
      return this.permissionRepository.save(permission);
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async remove(roleId: string): Promise<UpdateResult> {
    try {
      await this.getAndValidate(roleId);
      return this.permissionRepository.softDelete(roleId);
    } catch (error: any) {
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
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }
}
