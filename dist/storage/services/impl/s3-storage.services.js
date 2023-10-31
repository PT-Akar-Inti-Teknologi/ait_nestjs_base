"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageServices = void 0;
const node_path = __importStar(require("path"));
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
class S3StorageServices {
    constructor(config) {
        var _a;
        this.config = config;
        this.PRESIGNED_URL_TTL = 7200; // expires 1 hour
        this._log = new common_1.Logger(S3StorageServices.name);
        this._s3client = new client_s3_1.S3Client({
            credentials: {
                accessKeyId: this.config.s3Key,
                secretAccessKey: this.config.s3Secret,
            },
            region: this.config.s3Region,
        });
        this.S3_BUCKET = this.config.s3Bucket;
        this.S3_ROOT_FOLDER = (_a = this.config.s3RootFolder) !== null && _a !== void 0 ? _a : 'dev-test';
    }
    getRootFolderName() {
        return this.S3_ROOT_FOLDER;
    }
    async uploadFile(file) {
        const imageId = this.generateS3Dir(file.path, file.filename);
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.S3_BUCKET,
            Key: imageId,
            Body: file.buffer,
        });
        try {
            const result = await this._s3client
                .send(command)
                .catch((err) => {
                throw err;
            })
                .then((e) => {
                this._log.verbose(`Success S3Service: ${JSON.stringify(e)} `);
                return e;
            });
            return {
                key: imageId,
                bucket: this.S3_BUCKET,
                tag: result.ETag,
            };
        }
        catch (error) {
            this._log.error(`ERROR S3 Put file: ${error}`);
            throw error;
        }
    }
    async getFile(key) {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.S3_BUCKET,
            Key: key,
        });
        try {
            const result = await this._s3client.send(command);
            if (!result.Body) {
                throw new common_1.InternalServerErrorException('unknown S3 stream type!');
            }
            return result.Body;
        }
        catch (error) {
            this._log.error(`ERROR S3 Get file ${error}`);
            throw error;
        }
    }
    async getFilesFromDir(prefix) {
        const command = new client_s3_1.ListObjectsV2Command({
            Bucket: this.S3_BUCKET,
            Prefix: prefix,
        });
        try {
            const result = await this._s3client.send(command);
            if (!(result === null || result === void 0 ? void 0 : result.Contents)) {
                throw new common_1.InternalServerErrorException('Unknown S3 ListObjectsCommand params');
            }
            return result.Contents.map((item) => ((item === null || item === void 0 ? void 0 : item.Key) ? item.Key : ''));
        }
        catch (error) {
            this._log.error(`ERROR S3 Get files from dir ${error}`);
            throw error;
        }
    }
    async getObjectHeaderMetadata(key) {
        const command = new client_s3_1.HeadObjectCommand({
            Bucket: this.S3_BUCKET,
            Key: key,
        });
        if (!key)
            return null;
        try {
            const objMetadata = await this._s3client.send(command);
            return objMetadata;
        }
        catch (error) {
            this._log.error(`ERROR S3 GET HeadObject ${error}`);
            return null;
        }
    }
    async getPresignedUrl(key, withCached = Boolean(true)) {
        var _a;
        const command = new client_s3_1.GetObjectCommand({
            Bucket: this.S3_BUCKET,
            Key: key,
        });
        if (!key)
            return '';
        try {
            const presignedUrl = await (0, s3_request_presigner_1.getSignedUrl)(this._s3client, command, {
                expiresIn: this.PRESIGNED_URL_TTL,
            });
            let _presignUrlString = presignedUrl;
            if (withCached) {
                const objMeta = await this.getObjectHeaderMetadata(key);
                if (!objMeta)
                    return '';
                const unixTimestamp = Math.round(((_a = objMeta.LastModified) === null || _a === void 0 ? void 0 : _a.getTime()) / 1000);
                _presignUrlString = `${presignedUrl}&lastModified=${unixTimestamp}`;
            }
            return _presignUrlString;
        }
        catch (error) {
            this._log.error(`ERROR S3 get presign url: ${error}`);
            throw error;
        }
    }
    async deleteFile(key) {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: this.S3_BUCKET,
            Key: key,
        });
        try {
            const result = await this._s3client.send(command);
            return result.DeleteMarker ? true : false;
        }
        catch (error) {
            this._log.error(`ERROR S3 Delete file: ${error}`);
            throw error;
        }
    }
    async deleteFileByDirectory(prefix) {
        const command = new client_s3_1.ListObjectsV2Command({
            Bucket: this.S3_BUCKET,
            Prefix: prefix,
        });
        try {
            const listObjects = await this._s3client.send(command);
            if (!listObjects.Contents)
                return;
            if (listObjects.Contents.length == 0)
                return;
            if (listObjects.Contents.length > 0) {
                await Promise.all(listObjects.Contents.map(async (media) => {
                    return await this.deleteFile(media.Key);
                }));
            }
            if (listObjects.IsTruncated) {
                await this.deleteFileByDirectory(prefix);
            }
            this._log.verbose(`Success deleted S3 directory ${prefix}`);
        }
        catch (error) {
            this._log.error(`ERROR s3 Delete file by directory: ${error}`);
            throw error;
        }
    }
    parseFileName(url) {
        return node_path.basename(url);
    }
    generateS3Dir(pathDir, filename) {
        const normalizePath = node_path.normalize(pathDir);
        const path = node_path.format({
            dir: normalizePath,
            name: filename,
        });
        return path;
    }
}
exports.S3StorageServices = S3StorageServices;
//# sourceMappingURL=s3-storage.services.js.map