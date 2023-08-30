"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("./entities/permission.entity");
const response_service_1 = require("../../response/service/response.service");
const message_service_1 = require("../../response/service/message.service");
// noinspection ExceptionCaughtLocallyJS
let AuthPermissionsService = exports.AuthPermissionsService = class AuthPermissionsService {
    constructor(permissionRepository, messageService, responseService) {
        this.permissionRepository = permissionRepository;
        this.messageService = messageService;
        this.responseService = responseService;
    }
    async save(savePermissionDTO) {
        try {
            const permissionParam = Object.assign({}, savePermissionDTO);
            return this.permissionRepository.save(permissionParam);
        }
        catch (error) {
            common_1.Logger.error(error, '', this.constructor.name);
            this.responseService.throwError(error);
        }
    }
    async findOne(roleId) {
        try {
            return this.permissionRepository
                .createQueryBuilder('permission')
                .where('permission.role_id = :roleId', { roleId: roleId })
                .getOne();
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            this.responseService.throwError(error);
        }
    }
    async findAll(getPermissionDTO) {
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
                query.orderBy(`${prefix}${getPermissionDTO.sort}`, getPermissionDTO.order);
            }
            else {
                query.orderBy('permission.created_at', 'DESC');
            }
            query.take(getPermissionDTO.size);
            query.skip(getPermissionDTO.page * getPermissionDTO.size);
            const result = await query.getManyAndCount();
            return {
                list: result[0],
                count: result[1],
            };
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            this.responseService.throwError(error);
        }
    }
    async update(roleId, updatePermissionDTO) {
        try {
            const permission = await this.getAndValidate(roleId);
            Object.assign(permission, updatePermissionDTO);
            return this.permissionRepository.save(permission);
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            this.responseService.throwError(error);
        }
    }
    async remove(roleId) {
        try {
            await this.getAndValidate(roleId);
            return this.permissionRepository.softDelete(roleId);
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            this.responseService.throwError(error);
        }
    }
    // VALIDATION ====================================
    async getAndValidate(roleId) {
        try {
            const permission = await this.permissionRepository
                .createQueryBuilder('permission')
                .where('permission.role_id = :roleId', { roleId: roleId })
                .getOne();
            if (!permission) {
                throw new common_1.BadRequestException(this.responseService.error(common_1.HttpStatus.BAD_REQUEST, [
                    this.messageService.getErrorMessage('role_id', 'auth.role_id.invalid_role_id'),
                ], 'Bad Request'));
            }
            return permission;
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            this.responseService.throwError(error);
        }
    }
};
exports.AuthPermissionsService = AuthPermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.PermissionDocument)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        message_service_1.MessageService,
        response_service_1.ResponseService])
], AuthPermissionsService);
//# sourceMappingURL=auth-permissions.service.js.map