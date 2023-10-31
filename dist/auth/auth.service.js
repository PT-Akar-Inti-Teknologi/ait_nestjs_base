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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const operators_1 = require("rxjs/operators");
const response_service_1 = require("../response/response.service");
const message_service_1 = require("../message/message.service");
const auth_config_interface_1 = require("./guard/interface/auth-config.interface");
let AuthService = class AuthService {
    constructor(messageService, responseService, httpService, jwtService, aitAuthConfig) {
        this.messageService = messageService;
        this.responseService = responseService;
        this.httpService = httpService;
        this.jwtService = jwtService;
        this.aitAuthConfig = aitAuthConfig;
    }
    async postHttp(url, body, msgHandler) {
        return this.httpService.post(url, body).pipe((0, operators_1.map)((response) => response.data), (0, operators_1.catchError)((err) => {
            const errors = {
                field: msgHandler.property,
                message: this.messageService.get(msgHandler.map),
                code: '',
            };
            if (err.response == 'undefined') {
                throw new common_1.BadRequestException(this.responseService.error(common_1.HttpStatus.INTERNAL_SERVER_ERROR, [errors], 'Internal Server Error'));
            }
            throw new common_1.BadRequestException(this.responseService.error(err.response.status, [errors], err.response.data));
        }));
    }
    async createAccessToken(payload) {
        return this.jwtSign(payload, this.aitAuthConfig.jwtExpirationTime);
    }
    async createAccessRefreshToken(payload) {
        return this.jwtSign(payload, this.aitAuthConfig.refreshJwtExpirationTime);
    }
    async validateAccessToken(token) {
        return this.jwtPayload(token);
    }
    async checkExpirationTime(otptime, exptime) {
        const skg = new Date().getTime();
        const exp = otptime.getTime();
        if (skg - exp > exptime * 1000) {
            return true;
        }
        return false;
    }
    // jwt
    async jwtSign(payload, expiredIn) {
        return this.jwtService.sign(payload, {
            expiresIn: expiredIn,
        });
    }
    async jwtVerify(token) {
        // Env
        const authJwtTokenSecret = this.aitAuthConfig.jwtSecretKey;
        const payload = this.jwtService.verify(token, {
            secret: authJwtTokenSecret,
        });
        return payload ? true : false;
    }
    async jwtPayload(token, ignoreExpiration) {
        // Env
        const authJwtTokenSecret = this.aitAuthConfig.jwtSecretKey;
        return this.jwtService.verify(token, {
            secret: authJwtTokenSecret,
            ignoreExpiration,
        });
    }
    async generateToken(user) {
        const dailytoken = await this.createAccessToken(user);
        if (!dailytoken) {
            throw new common_1.BadRequestException(this.responseService.error(common_1.HttpStatus.UNAUTHORIZED, [
                this.messageService.getErrorMessage('token', 'auth.token.invalid_token'),
            ], 'UNAUTHORIZED'));
        }
        const refreshtoken = await this.createAccessRefreshToken(user);
        if (!refreshtoken) {
            throw new common_1.BadRequestException(this.responseService.error(common_1.HttpStatus.UNAUTHORIZED, [
                this.messageService.getErrorMessage('token', 'auth.token.invalid_token'),
            ], 'UNAUTHORIZED'));
        }
        return {
            token: dailytoken,
            refreshtoken: refreshtoken,
        };
    }
    async generateAccessToken(user) {
        const dailytoken = await this.createAccessToken(user);
        if (!dailytoken) {
            throw new common_1.BadRequestException(this.responseService.error(common_1.HttpStatus.UNAUTHORIZED, [
                this.messageService.getErrorMessage('token', 'auth.token.invalid_token'),
            ], 'UNAUTHORIZED'));
        }
        return dailytoken;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [message_service_1.MessageService,
        response_service_1.ResponseService,
        axios_1.HttpService,
        jwt_1.JwtService,
        auth_config_interface_1.AitAuthConfig])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map