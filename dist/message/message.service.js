"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
let MessageService = class MessageService {
    getRaw(key) {
        return {
            message: key,
            code: '',
        };
    }
    get(key) {
        const selectedMessage = this.getRaw(key);
        if (selectedMessage['message']) {
            return selectedMessage['message'];
        }
        return selectedMessage;
    }
    getErrorMessage(field, key) {
        const selectedMessage = this.getRaw(key);
        if (!selectedMessage['message']) {
            return {
                field,
                message: selectedMessage,
                code: '',
            };
        }
        return {
            field,
            message: selectedMessage['message'],
            code: selectedMessage['code'],
        };
    }
    getRequestErrorsMessage(requestErrors) {
        const messageErrors = requestErrors.map((value) => {
            return value.property[0];
        });
        return messageErrors[0];
    }
};
MessageService = __decorate([
    (0, common_1.Injectable)()
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map