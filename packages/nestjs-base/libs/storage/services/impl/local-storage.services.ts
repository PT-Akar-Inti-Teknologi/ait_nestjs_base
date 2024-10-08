import { Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { v4 } from 'uuid';
import { StorageConfigLocal } from '../../interfaces/storage-config.interface';
import {
  IFile,
  IStorageRepository,
  StorageResponse,
} from '../../interfaces/storage-repository.interface';

/**
 * Local storage files
 * Required define in .env
 *        STORAGE_DRIVER=local
 *        STORAGE_LOCAL_DIR=/tmp/loyalties
 */
export class LocalStorageServices implements IStorageRepository {
  private readonly BUCKET: string;
  private readonly log = new Logger(LocalStorageServices.name);

  constructor(config: StorageConfigLocal) {
    this.BUCKET = config.localDir || '/tmp';

    LocalStorageServices.ensureDir(this.BUCKET);
  }

  private static ensureDir(dir: string) {
    dir = path.resolve(dir);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
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
      // fixed file path in directory
      const filePath = path.resolve(path.join(this.BUCKET, key));

      LocalStorageServices.ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, file.buffer);

      return { key: key, bucket: this.BUCKET, tag: file.filename };
    } catch (e) {
      this.log.error(`ERROR upload file: ${e}`);
    }
  }

  async getFile(key: string): Promise<Readable> {
    try {
      return fs.createReadStream(path.resolve(path.join(this.BUCKET, key)));
    } catch (e) {
      this.log.error(`ERROR get file: ${e}`);

      throw e;
    }
  }

  async getFilesFromDir(prefix: string): Promise<string[]> {
    return fs
      .readdirSync(path.resolve(path.join(this.BUCKET, prefix)))
      .map((filename) => path.join(prefix, filename));
  }

  async getPresignedUrl(key: string): Promise<string> {
    return key;
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      fs.unlinkSync(path.resolve(path.join(this.BUCKET, key)));

      return true;
    } catch (e) {
      this.log.error(`ERROR delete file: ${e}`);
    }

    return false;
  }

  async copyFile(fromKey: string, toKey: string): Promise<boolean> {
    try {
      fs.copyFileSync(
        path.resolve(path.join(this.BUCKET, fromKey)),
        path.resolve(path.join(this.BUCKET, toKey)),
      );

      return true;
    } catch (e) {
      this.log.error(`ERROR copy file: ${e}`);
    }

    return false;
  }

  async moveFile(fromKey: string, toKey: string): Promise<boolean> {
    try {
      fs.copyFileSync(
        path.resolve(path.join(this.BUCKET, fromKey)),
        path.resolve(path.join(this.BUCKET, toKey)),
      );

      fs.unlinkSync(path.resolve(path.join(this.BUCKET, fromKey)));

      return true;
    } catch (e) {
      this.log.error(`ERROR move file: ${e}`);
    }

    return false;
  }

  async isFileExist(key: string): Promise<boolean> {
    return fs.existsSync(key);
  }

  async deleteFileByDirectory(prefix: string): Promise<void> {
    fs.rmSync(path.resolve(path.join(this.BUCKET, prefix)), {
      recursive: true,
      force: true,
    });
  }
}
