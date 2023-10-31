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
exports.ResponseServiceImpl = exports.ResponseService = void 0;
const common_1 = require("@nestjs/common");
const response_interface_1 = require("./response.interface");
let ResponseService = class ResponseService {
    responseCode(statusCode) {
        return statusCode.toString();
    }
    error(statusCode, messages, error) {
        return {
            response_schema: {
                response_code: this.responseCode(statusCode),
                response_message: error,
            },
            response_output: {
                errors: messages,
            },
        };
    }
    successCollection(content, pagination, message) {
        if (!pagination) {
            pagination = null;
        }
        if (!message) {
            message = 'Success';
        }
        return {
            response_schema: {
                response_code: this.responseCode(common_1.HttpStatus.OK),
                response_message: message,
            },
            response_output: {
                list: {
                    pagination,
                    content,
                },
            },
        };
    }
    success(content, message) {
        if (!message) {
            message = 'Success';
        }
        return {
            response_schema: {
                response_code: this.responseCode(common_1.HttpStatus.OK),
                response_message: message,
            },
            response_output: {
                detail: content,
            },
        };
    }
    throwError(error) {
        var _a, _b, _c;
        if ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.response_schema) === null || _b === void 0 ? void 0 : _b.response_code) {
            throw new common_1.BadRequestException(error.response);
        }
        if ((_c = error.response_schema) === null || _c === void 0 ? void 0 : _c.response_code) {
            throw new common_1.BadRequestException(error);
        }
        const errorMessage = {
            field: '',
            message: error.message,
            code: '',
        };
        throw new common_1.BadRequestException(this.error(common_1.HttpStatus.INTERNAL_SERVER_ERROR, [errorMessage], 'Internal Server Error'));
    }
};
ResponseService = __decorate([
    (0, common_1.Injectable)()
], ResponseService);
exports.ResponseService = ResponseService;
let ResponseServiceImpl = class ResponseServiceImpl extends ResponseService {
    constructor(config) {
        super();
        this.config = config;
    }
    responseCode(statusCode) {
        return `${this.config.projectName}-${this.config.serviceName}-${statusCode.toString()}`;
    }
};
ResponseServiceImpl = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [response_interface_1.ResponseServiceConfig])
], ResponseServiceImpl);
exports.ResponseServiceImpl = ResponseServiceImpl;
//# sourceMappingURL=response.service.js.map