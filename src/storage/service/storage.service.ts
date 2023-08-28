import { Readable } from 'stream';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IstorageService } from './istorage.service';
import { UploadRequestDto } from '../dto/request/upload-request.dto';
import { UploadResponseDto } from '../dto/response/upload-response.dto';
import { LocalStorageService } from './impl/local-storage.service';
import { FirebaseStorageService } from './impl/firebase-storage.service';
import { S3StorageServices } from './impl/s3-storage.service';

@Injectable()
export class StorageService implements IstorageService {
  private readonly storageImpl: IstorageService;

  constructor(configService: ConfigService) {
    const driver = configService.get<string>('STORAGE_DRIVER');

    if (driver == 'firebase') {
      this.storageImpl = new FirebaseStorageService(configService);
    } else if (driver == 's3') {
      this.storageImpl = new S3StorageServices(configService);
    } else {
      this.storageImpl = new LocalStorageService(configService);
    }
  }

  getRootFolderName(): string {
    return this.storageImpl.getRootFolderName();
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

  getSignedUrl(key: string, cache?: boolean): Promise<string> {
    return this.storageImpl.getSignedUrl(key, cache);
  }

  deleteFile(key: string): Promise<boolean> {
    return this.storageImpl.deleteFile(key);
  }

  deleteFileByDirectory(prefix: string): Promise<void> {
    return this.storageImpl.deleteFileByDirectory(prefix);
  }
}
