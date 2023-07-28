import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IStorageService } from 'src/storage/service/IStorageService';
import { UploadRequest } from 'src/storage/dto/request/UploadRequest';
import { UploadResponse } from 'src/storage/dto/response/UploadResponse';
import { LocalStorageService } from 'src/storage/service/impl/LocalStorageService';
import { FirebaseStorageService } from 'src/storage/service/impl/FirebaseStorageService';

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
