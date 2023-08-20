import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IStorageService } from './IStorageService';
import { UploadRequest } from '../dto/request/UploadRequest';
import { UploadResponse } from '../dto/response/UploadResponse';
import { LocalStorageService } from './impl/LocalStorageService';
import { FirebaseStorageService } from './impl/FirebaseStorageService';

@Injectable()
export class StorageService implements IStorageService {
  private readonly storageImpl: IStorageService;

  constructor(configService: ConfigService) {
    this.storageImpl =
      configService.get<string>('STORAGE_DRIVER') == 'local'
        ? new LocalStorageService(configService)
        : new FirebaseStorageService(configService);
  }

  uploadFile(uploadRequest: UploadRequest): Promise<UploadResponse> {
    return this.storageImpl.uploadFile(uploadRequest);
  }

  getFile(key: string): Promise<Readable> {
    return this.storageImpl.getFile(key);
  }

  getFilesFromDir(prefix: string): Promise<string[]> {
    return this.storageImpl.getFilesFromDir(prefix);
  }

  getSignedUrl(key: string): Promise<string> {
    return this.storageImpl.getSignedUrl(key);
  }

  deleteFile(key: string): Promise<boolean> {
    return this.storageImpl.deleteFile(key);
  }

  deleteFileByDirectory(prefix: string): Promise<void> {
    return this.storageImpl.deleteFileByDirectory(prefix);
  }
}
