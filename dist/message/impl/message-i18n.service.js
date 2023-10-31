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
exports.MessageI18nService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const message_service_1 = require("../message.service");
let MessageI18nService = class MessageI18nService extends message_service_1.MessageService {
    constructor(i18nService) {
        super();
        this.i18nService = i18nService;
    }
    getRaw(key) {
        var _a;
        return this.i18nService.t(key, { lang: (_a = nestjs_i18n_1.I18nContext.current()) === null || _a === void 0 ? void 0 : _a.lang });
    }
};
MessageI18nService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_i18n_1.I18nService])
], MessageI18nService);
exports.MessageI18nService = MessageI18nService;
//# sourceMappingURL=message-i18n.service.js.map