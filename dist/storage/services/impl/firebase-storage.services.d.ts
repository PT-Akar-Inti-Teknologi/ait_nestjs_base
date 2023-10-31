/// <reference types="node" />
import { Readable } from 'stream';
import { IFile, IStorageRepository, StorageResponse } from '../../interfaces/storage-repository.interface';
import { StorageConfigFirebase } from '../../interfaces/storage-config.interface';
/**
 * Firebase/Google cloud storage
 * Required define in .env
 *        STORAGE_DRIVER=firebase
 *        STORAGE_FIREBASE_BUCKET=<firebase storage bucket name>
 *        STORAGE_FIREBASE_KEY_FILE_PATH=<firebase-adminsdk-account.json>
 */
export declare class FirebaseStorageServices implements IStorageRepository {
    private readonly bucket;
    private readonly log;
    private readonly expireDays;
    constructor(config: StorageConfigFirebase);
    getRootFolderName(): string;
    uploadFile(file: IFile): Promise<StorageResponse>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getPresignedUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
}
//# sourceMappingURL=firebase-storage.services.d.ts.map