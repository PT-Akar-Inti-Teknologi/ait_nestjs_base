"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const message_service_1 = require("../response/service/message.service");
const response_service_1 = require("../response/service/response.service");
const hash_service_1 = require("../hash/hash.service");
let AuthModule = exports.AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
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
        ],
        controllers: [],
        providers: [
            message_service_1.MessageService,
            response_service_1.ResponseService,
            hash_service_1.HashService,
            config_1.ConfigService,
            config_1.ConfigModule,
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map