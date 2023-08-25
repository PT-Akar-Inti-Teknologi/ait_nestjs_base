"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
/**
 * Local storage files
 * Required define in .env
 *        STORAGE_DRIVER=local
 *        STORAGE_LOCAL_DIR=/tmp/loyalties
 */
class LocalStorageService {
    constructor(configService) {
        this.log = new common_1.Logger(LocalStorageService.name);
        this.BUCKET = configService.get('STORAGE_LOCAL_DIR') || '/tmp';
        LocalStorageService.ensureDir(this.BUCKET);
    }
    static ensureDir(dir) {
        dir = path_1.default.resolve(dir);
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir);
        }
    }
    async uploadFile(file) {
        try {
            // clean file name from file.path
            const cleanPath = file.path.replace(file.filename, '');
            // create new key of file with clean path
            const key = path_1.default.join(cleanPath, `${(0, uuid_1.v4)()}-${file.filename}`);
            // fixed file path in directory
            const filePath = path_1.default.resolve(path_1.default.join(this.BUCKET, key));
            LocalStorageService.ensureDir(path_1.default.dirname(filePath));
            fs_1.default.writeFileSync(filePath, file.buffer);
            return { key: key, bucket: this.BUCKET, tag: file.filename };
        }
        catch (e) {
            this.log.error(`ERROR upload file: ${e}`);
            throw e;
        }
    }
    async getFile(key) {
        try {
            return fs_1.default.createReadStream(path_1.default.resolve(path_1.default.join(this.BUCKET, key)));
        }
        catch (e) {
            this.log.error(`ERROR get file: ${e}`);
            throw e;
        }
    }
    async getFilesFromDir(prefix) {
        return fs_1.default
            .readdirSync(path_1.default.resolve(path_1.default.join(this.BUCKET, prefix)))
            .map((filename) => path_1.default.join(prefix, filename));
    }
    async getSignedUrl(key) {
        return key;
    }
    async deleteFile(key) {
        try {
            fs_1.default.unlinkSync(path_1.default.resolve(path_1.default.join(this.BUCKET, key)));
            return true;
        }
        catch (e) {
            this.log.error(`ERROR delete file: ${e}`);
        }
        return false;
    }
    async deleteFileByDirectory(prefix) {
        fs_1.default.rmSync(path_1.default.resolve(path_1.default.join(this.BUCKET, prefix)), {
            recursive: true,
            force: true,
        });
    }
}
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=local-storage.service.js.map