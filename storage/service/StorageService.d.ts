/// <reference types="node" />
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { IStorageService } from './IStorageService';
import { UploadRequest } from '../dto/request/UploadRequest';
import { UploadResponse } from '../dto/response/UploadResponse';
export declare class StorageService implements IStorageService {
    private readonly storageImpl;
    constructor(configService: ConfigService);
    uploadFile(uploadRequest: UploadRequest): Promise<UploadResponse>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getSignedUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
}
