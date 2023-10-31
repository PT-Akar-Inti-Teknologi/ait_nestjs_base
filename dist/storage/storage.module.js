"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AitStorageModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AitStorageModule = void 0;
const common_1 = require("@nestjs/common");
const storage_services_1 = require("./services/storage.services");
const storage_config_interface_1 = require("./interfaces/storage-config.interface");
let AitStorageModule = AitStorageModule_1 = class AitStorageModule {
    static register(config) {
        return {
            module: AitStorageModule_1,
            providers: [
                {
                    provide: storage_config_interface_1.StorageConfig,
                    useValue: config,
                },
                storage_services_1.StorageServices,
            ],
            exports: [storage_services_1.StorageServices],
        };
    }
};
AitStorageModule = AitStorageModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], AitStorageModule);
exports.AitStorageModule = AitStorageModule;
//# sourceMappingURL=storage.module.js.map