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
var AdminsUsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const service_base_1 = require("../../abstract-base/service/service.base");
const response_service_1 = require("../../response/response.service");
const message_service_1 = require("../../message/message.service");
const auth_permissions_service_1 = require("../permissions/auth-permissions.service");
let AdminsUsersService = AdminsUsersService_1 = class AdminsUsersService extends service_base_1.BaseService {
    constructor(adminUserRepository, authPermissionService, responseService, messageService) {
        super(adminUserRepository, responseService, messageService, AdminsUsersService_1.name);
        this.adminUserRepository = adminUserRepository;
        this.authPermissionService = authPermissionService;
        this.responseService = responseService;
        this.messageService = messageService;
        this.relations = ['admins_users.permission'];
        this.tableAlias = 'admins_users';
        this.searchByFields = [
            'admins_users.first_name',
            'admins_users.last_name',
            'admins_users.email',
        ];
    }
    async save(createDTO) {
        const savePermission = createDTO.role.permissions;
        await this.authPermissionService.save(savePermission);
        return this.baseSave(createDTO);
    }
    async getAndValidateByIds(ids) {
        try {
            const existSuperAdmins = await this.repository
                .createQueryBuilder(this.tableAlias)
                .where(`${this.tableAlias}.id IN(:...ids)`, { ids })
                .getMany();
            if (existSuperAdmins.length != ids.length) {
                const existIds = existSuperAdmins.map((superAdmin) => superAdmin.id);
                const notResigterd = ids.filter((id) => !existIds.includes(id));
                this.logger.error(`User Admins not registered : ${notResigterd} `, '', this.constructor.name);
                throw new common_1.BadRequestException(this.responseService.error(common_1.HttpStatus.BAD_REQUEST, [
                    this.messageService.getErrorMessage(`${this.tableAlias}_id`, 'general.general.id_not_found'),
                ], 'Bad Request'));
            }
            return existSuperAdmins;
        }
        catch (error) {
            this.logger.error(error.message, '', this.constructor.name);
            this.responseService.throwError(error);
        }
    }
};
AdminsUsersService = AdminsUsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.AdminsUserDocument)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        auth_permissions_service_1.AuthPermissionsService,
        response_service_1.ResponseService,
        message_service_1.MessageService])
], AdminsUsersService);
exports.AdminsUsersService = AdminsUsersService;
//# sourceMappingURL=admins-users.service.js.map