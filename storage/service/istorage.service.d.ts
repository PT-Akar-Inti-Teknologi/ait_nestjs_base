/// <reference types="node" />
import { Readable } from 'stream';
import { UploadRequestDto } from '../dto/request/upload-request.dto';
import { UploadResponseDto } from '../dto/response/upload-response.dto';
export interface IstorageService {
    getRootFolderName(): string;
    uploadFile(uploadRequest: UploadRequestDto): Promise<UploadResponseDto>;
    getFile(key: string): Promise<Readable>;
    getFilesFromDir(prefix: string): Promise<string[]>;
    getSignedUrl(key: string, cache?: boolean): Promise<string>;
    deleteFile(key: string): Promise<boolean>;
    deleteFileByDirectory(prefix: string): Promise<void>;
}
