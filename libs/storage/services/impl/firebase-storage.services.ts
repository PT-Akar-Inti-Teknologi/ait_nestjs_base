import path from 'path';
import { v4 } from 'uuid';
import { Logger } from '@nestjs/common';
import { Readable, PassThrough } from 'stream';
import { Storage, Bucket } from '@google-cloud/storage';
import {
  IFile,
  IStorageRepository,
  StorageResponse,
} from '../../interfaces/storage-repository.interface';
import { StorageConfigFirebase } from '../../interfaces/storage-config.interface';

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
  private readonly expireDays = 7;

  constructor(config: StorageConfigFirebase) {
    this.bucket = new Storage(config.firebaseInitOptions).bucket(
      config.firebaseBucket,
    );
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
    const expires = new Date();
    expires.setDate(expires.getDate() + this.expireDays);

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
      this.log.error(`ERROR delete file: ${e}`);
    }

    return false;
  }

  async deleteFileByDirectory(prefix: string): Promise<void> {
    await this.bucket.deleteFiles({ prefix });
  }
}
