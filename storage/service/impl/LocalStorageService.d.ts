/// <reference types="node" />
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { UploadRequest } from 'src/storage/dto/request/UploadRequest';
import { IStorageService } from 'src/storage/service/IStorageService';
import { UploadResponse } from 'src/storage/dto/response/UploadResponse';
/**
 * Local storage files
 * Required define in .env
 *        STORAGE_DRIVER=local
 *        STORAGE_LOCAL_DIR=/tmp/loyalties
 */
export declare class LocalStorageService implements IStorageService {
    private readonly BUCKET;
    private readonly log;
    constructor(configService: ConfigService);
    private static ensureDir;
    uploadFile(file: UploadRequest): Promise<UploadResponse>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getSignedUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
}
