"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AitAuthModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AitAuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_strategy_1 = require("./guard/jwt/jwt.strategy");
const response_service_1 = require("../response/response.service");
const auth_permissions_service_1 = require("../replication-data/permissions/auth-permissions.service");
const permission_entity_1 = require("../replication-data/permissions/entities/permission.entity");
const auth_config_interface_1 = require("./guard/interface/auth-config.interface");
let AitAuthModule = AitAuthModule_1 = class AitAuthModule {
    static register(config) {
        return {
            module: AitAuthModule_1,
            imports: [
                typeorm_1.TypeOrmModule.forFeature([permission_entity_1.PermissionDocument]),
                axios_1.HttpModule,
                jwt_1.JwtModule.register({
                    secret: config.jwtSecretKey,
                    signOptions: {
                        expiresIn: config.jwtExpirationTime,
                    },
                }),
            ],
            controllers: [],
            exports: [auth_service_1.AuthService],
            providers: [
                {
                    provide: auth_config_interface_1.AitAuthConfig,
                    useValue: config,
                },
                auth_service_1.AuthService,
                response_service_1.ResponseService,
                jwt_strategy_1.JwtStrategy,
                config_1.ConfigService,
                config_1.ConfigModule,
                auth_permissions_service_1.AuthPermissionsService,
            ],
        };
    }
};
AitAuthModule = AitAuthModule_1 = __decorate([
    (0, common_1.Module)({})
], AitAuthModule);
exports.AitAuthModule = AitAuthModule;
//# sourceMappingURL=auth.module.js.map