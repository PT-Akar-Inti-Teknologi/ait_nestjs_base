"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AitResponseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AitResponseModule = void 0;
const common_1 = require("@nestjs/common");
const response_service_1 = require("../response/response.service");
const response_interface_1 = require("./response.interface");
let AitResponseModule = AitResponseModule_1 = class AitResponseModule {
    static register(config) {
        return {
            module: AitResponseModule_1,
            providers: [
                {
                    provide: response_interface_1.ResponseServiceConfig,
                    useValue: config,
                },
                {
                    provide: response_service_1.ResponseService,
                    useClass: response_service_1.ResponseServiceImpl,
                },
            ],
            exports: [response_service_1.ResponseService],
            imports: [],
        };
    }
};
AitResponseModule = AitResponseModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], AitResponseModule);
exports.AitResponseModule = AitResponseModule;
//# sourceMappingURL=response.module.js.map