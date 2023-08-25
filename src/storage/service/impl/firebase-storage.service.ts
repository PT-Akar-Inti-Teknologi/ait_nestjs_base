import path from 'path';
import { v4 } from 'uuid';
import { Logger } from '@nestjs/common';
import { Readable, PassThrough } from 'stream';
import { ConfigService } from '@nestjs/config';
import { Storage, Bucket } from '@google-cloud/storage';

import { IstorageService } from '../istorage.service';
import { UploadRequestDto } from '../../dto/request/upload-request.dto';
import { UploadResponseDto } from '../../dto/response/upload-response.dto';

/**
 * Firebase/Google cloud storage
 * Required define in .env
 *        STORAGE_DRIVER=firebase
 *        STORAGE_FIREBASE_BUCKET=<firebase storage bucket name>
 *        STORAGE_FIREBASE_KEY_FILE_PATH=<firebase-adminsdk-account.json>
 */
export class FirebaseStorageService implements IstorageService {
  private readonly bucket: Bucket;
  private readonly log = new Logger(FirebaseStorageService.name);
  private readonly expireDays = 7;

  constructor(configService: ConfigService) {
    this.bucket = new Storage({
      keyFilename: configService.get<string>('STORAGE_FIREBASE_KEY_FILE_PATH'),
    }).bucket(configService.get<string>('STORAGE_FIREBASE_BUCKET') as string);
  }

  async uploadFile(file: UploadRequestDto): Promise<UploadResponseDto> {
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

  async getSignedUrl(key: string): Promise<string> {
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
