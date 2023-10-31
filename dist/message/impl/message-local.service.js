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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageLocalService = void 0;
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const message_service_1 = require("../message.service");
const interfaces_1 = require("../interfaces");
const message_constant_1 = __importDefault(require("../message.constant"));
let MessageLocalService = class MessageLocalService extends message_service_1.MessageService {
    constructor(config) {
        var _a;
        super();
        this.config = config;
        this.translations = (_a = config.translations) !== null && _a !== void 0 ? _a : message_constant_1.default;
    }
    getRaw(key) {
        return (0, lodash_1.get)(this.translations[this.config.fallbackLanguage], key, {
            message: key,
            code: '',
        });
    }
};
MessageLocalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.AitMessageConfig])
], MessageLocalService);
exports.MessageLocalService = MessageLocalService;
//# sourceMappingURL=message-local.service.js.map