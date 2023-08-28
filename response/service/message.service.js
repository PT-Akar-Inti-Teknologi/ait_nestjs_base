"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MessageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const response_module_1 = require("../response.module");
const error_message_dto_1 = require("../dto/response/error-message.dto");
let MessageService = exports.MessageService = MessageService_1 = class MessageService {
    static get language() {
        return response_module_1.ResponseModule.languages[(response_module_1.ResponseModule.selectedLanguage || process.env.APP_LANGUAGE)];
    }
    get(key) {
        const selectedMessage = (0, lodash_1.get)(MessageService_1.language, key, {
            message: key,
        });
        return (0, lodash_1.get)(selectedMessage, 'message', key);
    }
    getErrorMessage(field, key) {
        const selectedMessage = (0, lodash_1.get)(MessageService_1.language, key, {
            message: key,
            code: '',
        });
        const errorMessageResponse = error_message_dto_1.ErrorMessageDTO.Builder();
        errorMessageResponse.field(field);
        errorMessageResponse.message(selectedMessage['message']);
        errorMessageResponse.code(selectedMessage['code']);
        return errorMessageResponse.build();
    }
    getRequestErrorsMessage(requestErrors) {
        return requestErrors.map((value) => {
            return value.property[0];
        })[0];
    }
};
exports.MessageService = MessageService = MessageService_1 = __decorate([
    (0, common_1.Injectable)()
], MessageService);
//# sourceMappingURL=message.service.js.map