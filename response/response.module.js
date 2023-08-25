"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ResponseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseModule = void 0;
const common_1 = require("@nestjs/common");
const message_service_1 = require("./service/message.service");
const response_service_1 = require("./service/response.service");
let ResponseModule = exports.ResponseModule = ResponseModule_1 = class ResponseModule {
    static withLanguages(languages, selectedLanguage = 'id') {
        return {
            global: true,
            module: ResponseModule_1,
            providers: [
                {
                    provide: 'LANGUAGE_OPTIONS',
                    useValue: languages,
                },
                {
                    provide: 'SELECTED_LANGUAGE',
                    useValue: selectedLanguage,
                },
                message_service_1.MessageService,
                response_service_1.ResponseService,
            ],
            exports: [message_service_1.MessageService, response_service_1.ResponseService],
        };
    }
};
exports.ResponseModule = ResponseModule = ResponseModule_1 = __decorate([
    (0, common_1.Module)({})
], ResponseModule);
//# sourceMappingURL=response.module.js.map