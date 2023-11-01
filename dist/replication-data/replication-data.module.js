"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AitReplicationDataModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AitReplicationDataModule = void 0;
const common_1 = require("@nestjs/common");
const admins_users_module_1 = require("./admins-users/admins-users.module");
const permissions_module_1 = require("./permissions/permissions.module");
const core_1 = require("@nestjs/core");
let AitReplicationDataModule = AitReplicationDataModule_1 = class AitReplicationDataModule {
    static register(config) {
        const apiPrefix = config.apiPrefix.replace(/\/$/, '');
        return {
            module: AitReplicationDataModule_1,
            imports: [
                permissions_module_1.PermissionsModule,
                admins_users_module_1.AdminsUsersModule,
                core_1.RouterModule.register([
                    {
                        path: apiPrefix + '/auth-permissions',
                        module: permissions_module_1.PermissionsModule,
                    },
                    {
                        path: apiPrefix + '/admins/users',
                        module: admins_users_module_1.AdminsUsersModule,
                    },
                ]),
            ],
            controllers: [],
            providers: [],
            exports: [],
        };
    }
};
AitReplicationDataModule = AitReplicationDataModule_1 = __decorate([
    (0, common_1.Module)({})
], AitReplicationDataModule);
exports.AitReplicationDataModule = AitReplicationDataModule;
//# sourceMappingURL=replication-data.module.js.map