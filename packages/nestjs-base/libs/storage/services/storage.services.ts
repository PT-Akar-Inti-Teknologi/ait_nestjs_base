import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';

import {
  StorageConfig,
  StorageConfigFirebase,
  StorageConfigLocal,
  StorageConfigS3,
} from '../interfaces/storage-config.interface';
import {
  IFile,
  IStorageRepository,
  StorageResponse,
} from '../interfaces/storage-repository.interface';
import { FirebaseStorageServices } from './impl/firebase-storage.services';
import { LocalStorageServices } from './impl/local-storage.services';
import { S3StorageServices } from './impl/s3-storage.services';

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
@Injectable()
export class StorageServices implements IStorageRepository {
  private readonly storageImpl: IStorageRepository;

  constructor(config: StorageConfig) {
    this.storageImpl = StorageServices.loadDriver(config.driver, config);
  }

  /**
   * Auto wrap storage impl by .env STORAGE_DRIVER
   * default to local storage
   *
   * @param driver {string}
   * @param config {StorageConfig}
   */
  private static loadDriver(driver: string, config: StorageConfig) {
    driver = driver ? driver.toLowerCase() : 'local';

    switch (driver) {
      case 's3':
        return new S3StorageServices(config as StorageConfigS3);
      case 'firebase':
        return new FirebaseStorageServices(config as StorageConfigFirebase);
      default:
        return new LocalStorageServices(config as StorageConfigLocal);
    }
  }

  public getRootFolderName(): string {
    return '';
  }

  public uploadFile(iFile: IFile): Promise<StorageResponse> {
    return this.storageImpl.uploadFile(iFile);
  }

  public getFile(key: string): Promise<Readable> {
    return this.storageImpl.getFile(key);
  }

  public getFilesFromDir(prefix: string): Promise<string[]> {
    return this.storageImpl.getFilesFromDir(prefix);
  }

  public getPresignedUrl(key: string, withCached?: boolean): Promise<string> {
    return this.storageImpl.getPresignedUrl(key, withCached);
  }

  public deleteFile(key: string): Promise<boolean> {
    return this.storageImpl.deleteFile(key);
  }

  public deleteFileByDirectory(prefix: string): Promise<void> {
    return this.storageImpl.deleteFileByDirectory(prefix);
  }

  public moveFile(fromKey: string, toKey: string): Promise<boolean> {
    return this.storageImpl.moveFile(fromKey, toKey);
  }
}
