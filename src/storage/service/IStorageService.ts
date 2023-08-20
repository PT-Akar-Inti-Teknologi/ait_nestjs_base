import { Readable } from 'stream';

import { UploadRequest } from '../dto/request/UploadRequest';
import { UploadResponse } from '../dto/response/UploadResponse';

export interface IStorageService {
  uploadFile(uploadRequest: UploadRequest): Promise<UploadResponse>;

  getFile(key: string): Promise<Readable>;

  getFilesFromDir(prefix: string): Promise<string[]>;

  getSignedUrl(key: string): Promise<string>;

  deleteFile(key: string): Promise<boolean>;

  deleteFileByDirectory(prefix: string): Promise<void>;
}
