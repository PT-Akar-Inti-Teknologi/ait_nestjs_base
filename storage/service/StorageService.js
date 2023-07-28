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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const LocalStorageService_1 = require("./impl/LocalStorageService");
const FirebaseStorageService_1 = require("./impl/FirebaseStorageService");
let StorageService = exports.StorageService = class StorageService {
    constructor(configService) {
        this.storageImpl =
            configService.get('STORAGE_DRIVER') == 'local'
                ? new LocalStorageService_1.LocalStorageService(configService)
                : new FirebaseStorageService_1.FirebaseStorageService(configService);
    }
    uploadFile(uploadRequest) {
        return this.storageImpl.uploadFile(uploadRequest);
    }
    getFile(key) {
        return this.storageImpl.getFile(key);
    }
    getFilesFromDir(prefix) {
        return this.storageImpl.getFilesFromDir(prefix);
    }
    getSignedUrl(key) {
        return this.storageImpl.getSignedUrl(key);
    }
    deleteFile(key) {
        return this.storageImpl.deleteFile(key);
    }
    deleteFileByDirectory(prefix) {
        return this.storageImpl.deleteFileByDirectory(prefix);
    }
};
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=StorageService.js.map