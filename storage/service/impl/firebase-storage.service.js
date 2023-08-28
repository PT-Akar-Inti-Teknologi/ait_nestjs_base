"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseStorageService = void 0;
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const common_1 = require("@nestjs/common");
const stream_1 = require("stream");
const storage_1 = require("@google-cloud/storage");
/**
 * Firebase/Google cloud storage
 * Required define in .env
 *        STORAGE_DRIVER=firebase
 *        STORAGE_FIREBASE_BUCKET=<firebase storage bucket name>
 *        STORAGE_FIREBASE_KEY_FILE_PATH=<firebase-adminsdk-account.json>
 */
class FirebaseStorageService {
    constructor(configService) {
        this.log = new common_1.Logger(FirebaseStorageService.name);
        this.expireDays = 7;
        this.bucket = new storage_1.Storage({
            keyFilename: configService.get('STORAGE_FIREBASE_KEY_FILE_PATH'),
        }).bucket(configService.get('STORAGE_FIREBASE_BUCKET'));
    }
    getRootFolderName() {
        return '';
    }
    async uploadFile(file) {
        try {
            // clean file name from file.path
            const cleanPath = file.path.replace(file.filename, '');
            // create new key of file with clean path
            const key = path_1.default.join(cleanPath, `${(0, uuid_1.v4)()}-${file.filename}`);
            const writable = this.bucket.file(key).createWriteStream();
            const stream = new stream_1.PassThrough();
            stream.write(file.buffer);
            stream.end();
            await new Promise((resolve, reject) => stream.pipe(writable).on('finish', resolve).on('error', reject));
            return { key: key, bucket: this.bucket.getId(), tag: file.filename };
        }
        catch (e) {
            this.log.error(`ERROR upload file: ${e}`);
            throw e;
        }
    }
    async getFile(key) {
        try {
            return this.bucket.file(key).createReadStream();
        }
        catch (e) {
            this.log.error(`ERROR get file: ${e}`);
            throw e;
        }
    }
    async getFilesFromDir(prefix) {
        return this.bucket
            .getFiles({ prefix })
            .then((responses) => responses[0].map((f) => f.name));
    }
    async getSignedUrl(key) {
        const expires = new Date();
        expires.setDate(expires.getDate() + this.expireDays);
        return this.bucket
            .file(key)
            .getSignedUrl({ action: 'read', expires })
            .then((responses) => responses[0]);
    }
    async deleteFile(key) {
        try {
            await this.bucket.file(key).delete();
            return true;
        }
        catch (e) {
            this.log.error(`ERROR delete file: ${e}`);
        }
        return false;
    }
    async deleteFileByDirectory(prefix) {
        await this.bucket.deleteFiles({ prefix });
    }
}
exports.FirebaseStorageService = FirebaseStorageService;
//# sourceMappingURL=firebase-storage.service.js.map