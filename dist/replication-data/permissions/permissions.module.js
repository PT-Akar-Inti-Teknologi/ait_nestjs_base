"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const auth_permissions_controller_1 = require("./auth-permissions.controller");
const auth_permissions_service_1 = require("./auth-permissions.service");
const typeorm_1 = require("@nestjs/typeorm");
const permission_entity_1 = require("./entities/permission.entity");
let PermissionsModule = class PermissionsModule {
};
PermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([permission_entity_1.PermissionDocument])],
        controllers: [auth_permissions_controller_1.AuthPermissionController],
        providers: [auth_permissions_service_1.AuthPermissionsService],
        exports: [auth_permissions_service_1.AuthPermissionsService],
    })
], PermissionsModule);
exports.PermissionsModule = PermissionsModule;
//# sourceMappingURL=permissions.module.js.map