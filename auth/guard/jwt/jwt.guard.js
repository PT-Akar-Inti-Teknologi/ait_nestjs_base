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
exports.JwtGuard = void 0;
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const user_interface_1 = require("../interface/user.interface");
const jsonwebtoken_1 = require("jsonwebtoken");
const message_service_1 = require("../../../response/service/message.service");
const response_service_1 = require("../../../response/service/response.service");
let JwtGuard = exports.JwtGuard = class JwtGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(responseService, messageService, reflector) {
        super();
        this.responseService = responseService;
        this.messageService = messageService;
        this.reflector = reflector;
    }
    canActivate(context) {
        var _a, _b;
        this.user_type_and_levels =
            (_a = this.reflector.get('user_type_and_levels', context.getHandler())) !== null && _a !== void 0 ? _a : [];
        // jika menggunakan UserType() maka akan di set untuk semua level
        const user_types = (_b = this.reflector.get('user_types', context.getHandler())) !== null && _b !== void 0 ? _b : [];
        user_types.forEach((element) => {
            this.user_type_and_levels.push(element + '.*');
        });
        const permissionsHandler = this.reflector.get('permission', context.getHandler());
        this.permission = permissionsHandler ? permissionsHandler[0] : null;
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        const logger = new common_1.Logger();
        if (err) {
            throw new common_1.InternalServerErrorException(err);
        }
        const loggedInUser = user;
        if (!loggedInUser) {
            let error_message = this.messageService.getErrorMessage('token', 'auth.token.invalid_token');
            if (info instanceof jsonwebtoken_1.TokenExpiredError) {
                error_message = this.messageService.getErrorMessage('token', 'auth.token.expired_token');
            }
            logger.error('AuthJwtGuardError.Unauthorize', '', this.constructor.name);
            throw new common_1.UnauthorizedException(this.responseService.error(common_1.HttpStatus.UNAUTHORIZED, [error_message], 'Unauthorize'));
        }
        if (loggedInUser.user_type == user_interface_1.IUserType.Superadmin) {
            console.log('=================================SUPERADMIN=================================\n', new Date(Date.now()).toLocaleString(), '\n', 'id superadmin : ' + loggedInUser.id, '\n=================================SUPERADMIN=================================');
            return user;
        }
        if (
        //pengecekan user_type_and_level
        (this.user_type_and_levels.length &&
            !this.user_type_and_levels.includes(loggedInUser.user_type + '.*') &&
            !this.user_type_and_levels.includes(loggedInUser.user_type + '.' + loggedInUser.level)) ||
            //pengencekan permission
            (this.permission && !loggedInUser.permissions.includes(this.permission))) {
            logger.error(this.user_type_and_levels, '', this.constructor.name);
            logger.error(this.permission, '', this.constructor.name);
            logger.error(loggedInUser.permissions, '', this.constructor.name);
            logger.error('AuthJwtGuardError.Forbidden', '', this.constructor.name);
            throw new common_1.ForbiddenException(this.responseService.error(common_1.HttpStatus.FORBIDDEN, [
                this.messageService.getErrorMessage('token', 'auth.token.forbidden'),
            ], 'Forbidden Access'));
        }
        return user;
    }
};
exports.JwtGuard = JwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [response_service_1.ResponseService,
        message_service_1.MessageService,
        core_1.Reflector])
], JwtGuard);
//# sourceMappingURL=jwt.guard.js.map