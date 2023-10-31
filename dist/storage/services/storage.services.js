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
var StorageServices_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageServices = void 0;
const common_1 = require("@nestjs/common");
const s3_storage_services_1 = require("./impl/s3-storage.services");
const local_storage_services_1 = require("./impl/local-storage.services");
const firebase_storage_services_1 = require("./impl/firebase-storage.services");
const storage_config_interface_1 = require("../interfaces/storage-config.interface");
/**
 * Wrapper for various storage implementation
 * Need env prop:
 *
   # Storage (s3, firebase, local)
   STORAGE_DRIVER=local

   # Cloud Storage s3
   STORAGE_S3_KEY=
   STORAGE_S3_SECRET=
   STORAGE_S3_BUCKET=
   STORAGE_S3_REGION=
   STORAGE_ROOT_FOLDER=

   # LOCAL STORAGE
   STORAGE_LOCAL_DIR=<dir> example '/tmp/loyalties'

   # FIREBASE STORAGE
   STORAGE_FIREBASE_BUCKET=<firebase storage bucket name>
   STORAGE_FIREBASE_KEY_FILE_PATH=<firebase-adminsdk-account.json>
 */
let StorageServices = StorageServices_1 = class StorageServices {
    constructor(config) {
        this.storageImpl = StorageServices_1.loadDriver(config.driver, config);
    }
    /**
     * Auto wrap storage impl by .env STORAGE_DRIVER
     * default to local storage
     *
     * @param driver {string}
     * @param config {StorageConfig}
     */
    static loadDriver(driver, config) {
        driver = driver ? driver.toLowerCase() : 'local';
        switch (driver) {
            case 's3':
                return new s3_storage_services_1.S3StorageServices(config);
            case 'firebase':
                return new firebase_storage_services_1.FirebaseStorageServices(config);
            default:
                return new local_storage_services_1.LocalStorageServices(config);
        }
    }
    getRootFolderName() {
        return '';
    }
    uploadFile(iFile) {
        return this.storageImpl.uploadFile(iFile);
    }
    getFile(key) {
        return this.storageImpl.getFile(key);
    }
    getFilesFromDir(prefix) {
        return this.storageImpl.getFilesFromDir(prefix);
    }
    getPresignedUrl(key, withCached) {
        return this.storageImpl.getPresignedUrl(key, withCached);
    }
    deleteFile(key) {
        return this.storageImpl.deleteFile(key);
    }
    deleteFileByDirectory(prefix) {
        return this.storageImpl.deleteFileByDirectory(prefix);
    }
};
StorageServices = StorageServices_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_config_interface_1.StorageConfig])
], StorageServices);
exports.StorageServices = StorageServices;
//# sourceMappingURL=storage.services.js.map