import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IstorageService } from './istorage.service';
import { UploadRequestDto } from '../dto/request/upload-request.dto';
import { UploadResponseDto } from '../dto/response/upload-response.dto';
import { LocalStorageService } from './impl/local-storage.service';
import { FirebaseStorageService } from './impl/firebase-storage.service';

@Injectable()
export class StorageService implements IstorageService {
  private readonly storageImpl: IstorageService;

  constructor(configService: ConfigService) {
    this.storageImpl =
      configService.get<string>('STORAGE_DRIVER') == 'local'
        ? new LocalStorageService(configService)
        : new FirebaseStorageService(configService);
  }

  uploadFile(uploadRequest: UploadRequestDto): Promise<UploadResponseDto> {
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
