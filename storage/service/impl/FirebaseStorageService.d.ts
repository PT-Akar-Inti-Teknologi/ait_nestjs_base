/// <reference types="node" />
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { IStorageService } from '../IStorageService';
import { UploadRequestDTO } from '../../dto/request/UploadRequestDTO';
import { UploadResponseDTO } from '../../dto/response/UploadResponseDTO';
/**
 * Firebase/Google cloud storage
 * Required define in .env
 *        STORAGE_DRIVER=firebase
 *        STORAGE_FIREBASE_BUCKET=<firebase storage bucket name>
 *        STORAGE_FIREBASE_KEY_FILE_PATH=<firebase-adminsdk-account.json>
 */
export declare class FirebaseStorageService implements IStorageService {
    private readonly bucket;
    private readonly log;
    private readonly expireDays;
    constructor(configService: ConfigService);
    uploadFile(file: UploadRequestDTO): Promise<UploadResponseDTO>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getSignedUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
}
