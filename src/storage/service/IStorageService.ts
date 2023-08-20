import { Readable } from 'stream';

import { UploadRequestDTO } from '../dto/request/UploadRequestDTO';
import { UploadResponseDTO } from '../dto/response/UploadResponseDTO';

export interface IStorageService {
  uploadFile(uploadRequest: UploadRequestDTO): Promise<UploadResponseDTO>;

  getFile(key: string): Promise<Readable>;

  getFilesFromDir(prefix: string): Promise<string[]>;

  getSignedUrl(key: string): Promise<string>;

  deleteFile(key: string): Promise<boolean>;

  deleteFileByDirectory(prefix: string): Promise<void>;
}
