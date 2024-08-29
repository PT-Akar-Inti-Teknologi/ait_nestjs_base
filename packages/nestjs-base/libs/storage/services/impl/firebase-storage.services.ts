import { Bucket, Storage } from '@google-cloud/storage';
import { Logger } from '@nestjs/common';
import path from 'path';
import { PassThrough, Readable } from 'stream';
import { v4 } from 'uuid';
import { StorageConfigFirebase } from '../../interfaces/storage-config.interface';
import {
  IFile,
  IStorageRepository,
  StorageResponse,
} from '../../interfaces/storage-repository.interface';

/**
 * Firebase/Google cloud storage
 * Required define in .env
 *        STORAGE_DRIVER=firebase
 *        STORAGE_FIREBASE_BUCKET=<firebase storage bucket name>
 *        STORAGE_FIREBASE_KEY_FILE_PATH=<firebase-adminsdk-account.json>
 */
export class FirebaseStorageServices implements IStorageRepository {
  private readonly bucket: Bucket;
  private readonly log = new Logger(FirebaseStorageServices.name);
  private presignTtl: number; // ttl in seconds

  constructor(config: StorageConfigFirebase) {
    this.bucket = new Storage(config.firebaseInitOptions).bucket(
      config.firebaseBucket,
    );
    this.presignTtl = config.presignTtl ?? 7200;
  }

  public getRootFolderName(): string {
    return '';
  }

  async uploadFile(file: IFile): Promise<StorageResponse> {
    try {
      // clean file name from file.path
      const cleanPath = file.path.replace(file.filename, '');
      // create new key of file with clean path
      const key = path.join(cleanPath, `${v4()}-${file.filename}`);

      const writable = this.bucket.file(key).createWriteStream();
      const stream = new PassThrough();
      stream.write(file.buffer);
      stream.end();

      await new Promise((resolve, reject) =>
        stream.pipe(writable).on('finish', resolve).on('error', reject),
      );

      return { key: key, bucket: this.bucket.getId(), tag: file.filename };
    } catch (e) {
      this.log.error(`ERROR upload file: ${e}`);

      throw e;
    }
  }

  async getFile(key: string): Promise<Readable> {
    try {
      return this.bucket.file(key).createReadStream();
    } catch (e) {
      this.log.error(`ERROR get file: ${e}`);

      throw e;
    }
  }

  async getFilesFromDir(prefix: string): Promise<string[]> {
    return this.bucket
      .getFiles({ prefix })
      .then((responses) => responses[0].map((f) => f.name));
  }

  async getPresignedUrl(key: string): Promise<string> {
    if (!key) return '';

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.presignTtl);

    return this.bucket
      .file(key)
      .getSignedUrl({ action: 'read', expires })
      .then((responses) => responses[0]);
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.bucket.file(key).delete();

      return true;
    } catch (e) {
      this.log.error(`ERROR copy file: ${e}`);
    }

    return false;
  }

  async copyFile(fromKey: string, toKey: string): Promise<boolean> {
    try {
      await this.bucket.file(fromKey).copy(toKey);

      return true;
    } catch (e) {
      this.log.error(`ERROR move file: ${e}`);
    }

    return false;
  }

  async moveFile(fromKey: string, toKey: string): Promise<boolean> {
    try {
      await this.bucket.file(fromKey).move(toKey);

      return true;
    } catch (e) {
      this.log.error(`ERROR move file: ${e}`);
    }

    return false;
  }

  async isFileExist(key: string): Promise<boolean> {
    return (await this.bucket.file(key).exists())[0];
  }

  async deleteFileByDirectory(prefix: string): Promise<void> {
    await this.bucket.deleteFiles({ prefix });
  }
}
