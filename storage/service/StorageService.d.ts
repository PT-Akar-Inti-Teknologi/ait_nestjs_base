/// <reference types="node" />
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { IStorageService } from './IStorageService';
import { UploadRequestDTO } from '../dto/request/UploadRequestDTO';
import { UploadResponseDTO } from '../dto/response/UploadResponseDTO';
export declare class StorageService implements IStorageService {
    private readonly storageImpl;
    constructor(configService: ConfigService);
    uploadFile(uploadRequest: UploadRequestDTO): Promise<UploadResponseDTO>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getSignedUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
}
