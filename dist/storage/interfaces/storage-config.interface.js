"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageConfigLocal = exports.StorageConfigS3 = exports.StorageConfigFirebase = exports.StorageConfig = void 0;
class StorageConfig {
}
exports.StorageConfig = StorageConfig;
class StorageConfigFirebase extends StorageConfig {
    constructor(options) {
        super();
        Object.assign(this, options);
    }
}
exports.StorageConfigFirebase = StorageConfigFirebase;
class StorageConfigS3 extends StorageConfig {
}
exports.StorageConfigS3 = StorageConfigS3;
class StorageConfigLocal extends StorageConfig {
}
exports.StorageConfigLocal = StorageConfigLocal;
//# sourceMappingURL=storage-config.interface.js.map