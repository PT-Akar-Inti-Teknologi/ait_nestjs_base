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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const ErrorMessageDTO_1 = require("../dto/response/ErrorMessageDTO");
let MessageService = exports.MessageService = class MessageService {
    constructor(languages, selectedLanguage) {
        this.languages = languages;
        this.selectedLanguage = selectedLanguage;
    }
    get(key) {
        const selectedMessage = (0, lodash_1.get)(this.languages[this.selectedLanguage], key, {
            message: key,
        });
        return (0, lodash_1.get)(selectedMessage, 'message', key);
    }
    getErrorMessage(field, key) {
        const selectedMessage = (0, lodash_1.get)(this.languages[this.selectedLanguage], key, {
            message: key,
            code: '',
        });
        const errorMessageResponse = ErrorMessageDTO_1.ErrorMessageDTO.Builder();
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
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LANGUAGE_OPTIONS')),
    __param(1, (0, common_1.Inject)('SELECTED_LANGUAGE')),
    __metadata("design:paramtypes", [Object, String])
], MessageService);
//# sourceMappingURL=MessageService.js.map