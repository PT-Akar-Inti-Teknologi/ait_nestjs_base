"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var AitMessageModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AitMessageModule = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./message.service");
const nestjs_i18n_1 = require("nestjs-i18n");
const interfaces_1 = require("./interfaces");
const message_i18n_service_1 = require("./impl/message-i18n.service");
const message_local_service_1 = require("./impl/message-local.service");
let AitMessageModule = AitMessageModule_1 = class AitMessageModule {
    static register(config) {
        const { useNestI18n } = config, i18nConfig = __rest(config, ["useNestI18n"]);
        const imports = [];
        if (useNestI18n) {
            imports.push(nestjs_i18n_1.I18nModule.forRoot(i18nConfig));
        }
        return {
            module: AitMessageModule_1,
            imports,
            providers: [
                {
                    provide: interfaces_1.AitMessageConfig,
                    useValue: config,
                },
                {
                    provide: message_service_1.MessageService,
                    useClass: useNestI18n ? message_i18n_service_1.MessageI18nService : message_local_service_1.MessageLocalService,
                },
            ],
            exports: [message_service_1.MessageService],
        };
    }
};
AitMessageModule = AitMessageModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], AitMessageModule);
exports.AitMessageModule = AitMessageModule;
//# sourceMappingURL=message.module.js.map