/// <reference types="node" />
import { Readable } from 'stream';
import { IFile, IStorageRepository, StorageResponse } from '../../interfaces/storage-repository.interface';
import { StorageConfigLocal } from '../../interfaces/storage-config.interface';
/**
 * Local storage files
 * Required define in .env
 *        STORAGE_DRIVER=local
 *        STORAGE_LOCAL_DIR=/tmp/loyalties
 */
export declare class LocalStorageServices implements IStorageRepository {
    private readonly BUCKET;
    private readonly log;
    constructor(config: StorageConfigLocal);
    private static ensureDir;
    getRootFolderName(): string;
    uploadFile(file: IFile): Promise<StorageResponse>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getPresignedUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
}
//# sourceMappingURL=local-storage.services.d.ts.map