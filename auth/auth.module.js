"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const jwt_1 = require("@nestjs/jwt");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const response_service_1 = require("../response/service/response.service");
const message_service_1 = require("../response/service/message.service");
const jwt_strategy_1 = require("./guard/jwt/jwt.strategy");
const hash_service_1 = require("../hash/hash.service");
const auth_permissions_controller_1 = require("./permissions/auth-permissions.controller");
const auth_permissions_service_1 = require("./permissions/auth-permissions.service");
const permission_entity_1 = require("./permissions/entities/permission.entity");
let AuthModule = exports.AuthModule = AuthModule_1 = class AuthModule {
    static forRoot(options) {
        const module = {
            global: true,
            module: AuthModule_1,
            imports: [
                axios_1.HttpModule,
                config_1.ConfigModule.forRoot(),
                jwt_1.JwtModule.registerAsync({
                    inject: [config_1.ConfigService],
                    imports: [config_1.ConfigModule],
                    useFactory: () => {
                        return {
                            secret: process.env.AUTH_JWTSECRETKEY,
                            signOptions: {
                                expiresIn: process.env.AUTH_JWTEXPIRATIONTIME,
                            },
                        };
                    },
                }),
                typeorm_1.TypeOrmModule.forFeature([permission_entity_1.PermissionDocument]),
            ],
            providers: [
                message_service_1.MessageService,
                response_service_1.ResponseService,
                hash_service_1.HashService,
                config_1.ConfigService,
                config_1.ConfigModule,
                jwt_strategy_1.JwtStrategy,
                auth_permissions_service_1.AuthPermissionsService,
            ],
        };
        if (options.enableAuthPermissionController) {
            module.controllers = [auth_permissions_controller_1.AuthPermissionController];
        }
        module.exports = module.providers;
        return module;
    }
};
exports.AuthModule = AuthModule = AuthModule_1 = __decorate([
    (0, common_1.Module)({})
], AuthModule);
//# sourceMappingURL=auth.module.js.map