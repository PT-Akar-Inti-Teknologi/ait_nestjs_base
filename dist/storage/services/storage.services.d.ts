/// <reference types="node" />
import { Readable } from 'stream';
import { IFile, IStorageRepository, StorageResponse } from '../interfaces/storage-repository.interface';
import { StorageConfig } from '../interfaces/storage-config.interface';
/**
 * Wrapper for various storage implementation
 * Need env prop:
 *
   # Storage (s3, firebase, local)
   STORAGE_DRIVER=local

   # Cloud Storage s3
   STORAGE_S3_KEY=
   STORAGE_S3_SECRET=
   STORAGE_S3_BUCKET=
   STORAGE_S3_REGION=
   STORAGE_ROOT_FOLDER=

   # LOCAL STORAGE
   STORAGE_LOCAL_DIR=<dir> example '/tmp/loyalties'

   # FIREBASE STORAGE
   STORAGE_FIREBASE_BUCKET=<firebase storage bucket name>
   STORAGE_FIREBASE_KEY_FILE_PATH=<firebase-adminsdk-account.json>
 */
export declare class StorageServices implements IStorageRepository {
    private readonly storageImpl;
    constructor(config: StorageConfig);
    /**
     * Auto wrap storage impl by .env STORAGE_DRIVER
     * default to local storage
     *
     * @param driver {string}
     * @param config {StorageConfig}
     */
    private static loadDriver;
    getRootFolderName(): string;
    uploadFile(iFile: IFile): Promise<StorageResponse>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getPresignedUrl(key: string, withCached?: boolean): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
}
//# sourceMappingURL=storage.services.d.ts.map