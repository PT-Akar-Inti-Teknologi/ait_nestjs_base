"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AitHashModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AitHashModule = void 0;
const common_1 = require("@nestjs/common");
const hash_service_1 = require("./hash.service");
const hash_module_config_interface_1 = require("./interface/hash-module-config.interface");
let AitHashModule = AitHashModule_1 = class AitHashModule {
    static register(config) {
        return {
            module: AitHashModule_1,
            providers: [{ provide: hash_module_config_interface_1.HashModuleConfig, useValue: config }, hash_service_1.HashService],
            exports: [hash_service_1.HashService],
            imports: [],
        };
    }
};
AitHashModule = AitHashModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], AitHashModule);
exports.AitHashModule = AitHashModule;
//# sourceMappingURL=hash.module.js.map