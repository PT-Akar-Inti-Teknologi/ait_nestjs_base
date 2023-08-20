import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { Readable } from 'stream';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IStorageService } from '../IStorageService';
import { UploadRequest } from '../../dto/request/UploadRequest';
import { UploadResponse } from '../../dto/response/UploadResponse';

/**
 * Local storage files
 * Required define in .env
 *        STORAGE_DRIVER=local
 *        STORAGE_LOCAL_DIR=/tmp/loyalties
 */
export class LocalStorageService implements IStorageService {
  private readonly BUCKET: string;
  private readonly log = new Logger(LocalStorageService.name);

  constructor(configService: ConfigService) {
    this.BUCKET = configService.get<string>('STORAGE_LOCAL_DIR') || '/tmp';

    LocalStorageService.ensureDir(this.BUCKET);
  }

  private static ensureDir(dir: string) {
    dir = path.resolve(dir);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  async uploadFile(file: UploadRequest): Promise<UploadResponse> {
    try {
      // clean file name from file.path
      const cleanPath = file.path.replace(file.filename, '');
      // create new key of file with clean path
      const key = path.join(cleanPath, `${v4()}-${file.filename}`);
      // fixed file path in directory
      const filePath = path.resolve(path.join(this.BUCKET, key));

      LocalStorageService.ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, file.buffer);

      return { key: key, bucket: this.BUCKET, tag: file.filename };
    } catch (e) {
      this.log.error(`ERROR upload file: ${e}`);

      throw e;
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

  async getSignedUrl(key: string): Promise<string> {
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

  async deleteFileByDirectory(prefix: string): Promise<void> {
    fs.rmSync(path.resolve(path.join(this.BUCKET, prefix)), {
      recursive: true,
      force: true,
    });
  }
}
