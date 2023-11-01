"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsUsersModule = void 0;
const common_1 = require("@nestjs/common");
const admins_users_service_1 = require("./admins-users.service");
const admins_users_controller_1 = require("./admins-users.controller");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const user_entity_1 = require("./entities/user.entity");
const superadmin_seeder_1 = require("./seeders/superadmin.seeder");
const permission_entity_1 = require("../permissions/entities/permission.entity");
const permissions_module_1 = require("../permissions/permissions.module");
let AdminsUsersModule = class AdminsUsersModule {
};
AdminsUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.AdminsUserDocument, permission_entity_1.PermissionDocument]),
            permissions_module_1.PermissionsModule,
        ],
        controllers: [admins_users_controller_1.AdminsUsersController],
        providers: [admins_users_service_1.AdminsUsersService, superadmin_seeder_1.SuperAdminSeeder],
        exports: [admins_users_service_1.AdminsUsersService, superadmin_seeder_1.SuperAdminSeeder],
    })
], AdminsUsersModule);
exports.AdminsUsersModule = AdminsUsersModule;
//# sourceMappingURL=admins-users.module.js.map