/// <reference types="node" />
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { IstorageService } from '../istorage.service';
import { UploadRequestDto } from '../../dto/request/upload-request.dto';
import { UploadResponseDto } from '../../dto/response/upload-response.dto';
/**
 * Local storage files
 * Required define in .env
 *        STORAGE_DRIVER=local
 *        STORAGE_LOCAL_DIR=/tmp/loyalties
 */
export declare class LocalStorageService implements IstorageService {
    private readonly BUCKET;
    private readonly log;
    constructor(configService: ConfigService);
    private static ensureDir;
    uploadFile(file: UploadRequestDto): Promise<UploadResponseDto>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getSignedUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
}
