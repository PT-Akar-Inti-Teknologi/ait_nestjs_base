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
exports.ResponseFilter = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("../message/message.service");
// Restructure Response Object For Guard Exception
let ResponseFilter = class ResponseFilter {
    constructor(messageService) {
        this.messageService = messageService;
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof common_1.HttpException) {
            const status = exception.getStatus();
            response.status(status).json(exception.getResponse());
        }
        else {
            if (exception.statusCode) {
                const errorStatusCodeResponse = {
                    response_schema: {
                        response_code: exception.statusCode.toString(),
                        response_message: exception.message,
                    },
                    response_output: {
                        errors: exception.error,
                    },
                };
                response.status(exception.statusCode).json(errorStatusCodeResponse);
            }
            // if error is not http cause
            const status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const errorResponse = {
                response_schema: {
                    response_code: status.toString(),
                    response_message: this.messageService.get('http.serverError.internalServerError'),
                },
                response_output: null,
            };
            response.status(status).json(errorResponse);
        }
    }
};
ResponseFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException),
    __metadata("design:paramtypes", [message_service_1.MessageService])
], ResponseFilter);
exports.ResponseFilter = ResponseFilter;
//# sourceMappingURL=response.filter.js.map