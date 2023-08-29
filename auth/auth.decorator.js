"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.Response = exports.User = exports.AuthJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("./guard/jwt/jwt.guard");
function AuthJwtGuard() {
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(jwt_guard_1.JwtGuard));
}
exports.AuthJwtGuard = AuthJwtGuard;
exports.User = (0, common_1.createParamDecorator)((data, ctx) => {
    const { user } = ctx.switchToHttp().getRequest();
    const response = data ? user[data] : user;
    return response;
});
function Response() {
    return (0, common_1.Inject)(`ResponseService`);
}
exports.Response = Response;
function Message() {
    return (0, common_1.Inject)(`MessageService`);
}
exports.Message = Message;
//# sourceMappingURL=auth.decorator.js.map