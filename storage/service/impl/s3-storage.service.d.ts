/// <reference types="node" />
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { UploadRequestDto } from '../../dto/request/upload-request.dto';
import { UploadResponseDto } from '../../dto/response/upload-response.dto';
import { IstorageService } from '../istorage.service';
/**
 * S3 cloud storage
 * Required define in .env
 *        STORAGE_S3_KEY=
 *        STORAGE_S3_SECRET=
 *        STORAGE_S3_BUCKET=
 *        STORAGE_S3_REGION=
 */
export declare class S3StorageServices implements IstorageService {
    private readonly S3_BUCKET;
    private readonly S3_ROOT_FOLDER;
    private PRE_SIGNED_URL_TTL;
    private readonly _s3client;
    private _log;
    constructor(configService: ConfigService);
    private getObjectHeaderMetadata;
    private static generateS3Dir;
    getRootFolderName(): string;
    uploadFile(file: UploadRequestDto): Promise<UploadResponseDto>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getSignedUrl(key: string, withCached?: boolean): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
}
