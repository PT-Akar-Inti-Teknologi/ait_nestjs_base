/// <reference types="node" />
import { Readable } from 'stream';
import { HeadObjectCommandOutput } from '@aws-sdk/client-s3';
import { IFile, IStorageRepository, StorageResponse } from '../../interfaces/storage-repository.interface';
import { StorageConfigS3 } from '../../interfaces/storage-config.interface';
export declare class S3StorageServices implements IStorageRepository {
    private config;
    private S3_BUCKET;
    private S3_ROOT_FOLDER;
    private PRESIGNED_URL_TTL;
    private _s3client;
    private _log;
    constructor(config: StorageConfigS3);
    getRootFolderName(): string;
    uploadFile(file: IFile): Promise<StorageResponse>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getObjectHeaderMetadata(key: string): Promise<HeadObjectCommandOutput>;
    getPresignedUrl(key: string, withCached?: boolean): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
    private parseFileName;
    private generateS3Dir;
}
//# sourceMappingURL=s3-storage.services.d.ts.map