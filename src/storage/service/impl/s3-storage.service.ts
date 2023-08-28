import * as node_path from 'path';
import { Readable } from 'stream';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { UploadRequestDto } from '../../dto/request/upload-request.dto';
import { UploadResponseDto } from '../../dto/response/upload-response.dto';
import { IstorageService } from '../istorage.service';

/**
 * S3 cloud storage
 * Required define in .env
 *        STORAGE_S3_KEY=
 *        STORAGE_S3_SECRET=
 *        STORAGE_S3_BUCKET=
 *        STORAGE_S3_REGION=
 */
// noinspection ExceptionCaughtLocallyJS
export class S3StorageServices implements IstorageService {
  private readonly S3_BUCKET: string;
  private readonly S3_ROOT_FOLDER: string;
  private PRE_SIGNED_URL_TTL = 7200; // expires 1 hour

  private readonly _s3client: S3Client;
  private _log = new Logger(S3StorageServices.name);

  constructor(configService: ConfigService) {
    this._s3client = new S3Client({
      credentials: {
        accessKeyId: configService.get<any>('STORAGE_S3_KEY'),
        secretAccessKey: configService.get<any>('STORAGE_S3_SECRET'),
      },
      region: configService.get<any>('STORAGE_S3_REGION'),
    });

    this.S3_BUCKET = configService.get<any>('STORAGE_S3_BUCKET');
    this.S3_ROOT_FOLDER =
      configService.get<any>('STORAGE_ROOT_FOLDER') ?? 'dev-test';
  }

  private async getObjectHeaderMetadata(
    key: string,
  ): Promise<HeadObjectCommandOutput | any> {
    const command = new HeadObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: key,
    });

    if (!key) return null;

    try {
      return await this._s3client.send(command);
    } catch (error) {
      this._log.error(`ERROR S3 GET HeadObject ${error}`);
      return null;
    }
  }

  private static generateS3Dir(pathDir: string, filename: string): string {
    const normalizePath = node_path.normalize(pathDir);
    return node_path.format({
      dir: normalizePath,
      name: filename,
    });
  }

  getRootFolderName(): string {
    return this.S3_ROOT_FOLDER;
  }

  async uploadFile(file: UploadRequestDto): Promise<UploadResponseDto> {
    const imageId = S3StorageServices.generateS3Dir(file.path, file.filename);

    const command = new PutObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: imageId,
      Body: file.buffer,
    });

    try {
      const result: any = await this._s3client
        .send(command)
        .catch((err) => {
          throw err;
        })
        .then((e) => {
          this._log.verbose(`Success S3Service: ${JSON.stringify(e)} `);
          return e;
        });

      return {
        key: imageId,
        bucket: this.S3_BUCKET,
        tag: result.ETag,
      };
    } catch (error) {
      this._log.error(`ERROR S3 Put file: ${error}`);
      throw error;
    }
  }

  async getFile(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: key,
    });

    try {
      const result = await this._s3client.send(command);
      if (!result.Body) {
        throw new InternalServerErrorException('unknown S3 stream type!');
      }

      return result.Body as Readable;
    } catch (error) {
      this._log.error(`ERROR S3 Get file ${error}`);
      throw error;
    }
  }

  async getFilesFromDir(prefix: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.S3_BUCKET,
      Prefix: prefix,
    });

    const result = await this._s3client.send(command);

    if (!result?.Contents) {
      throw new InternalServerErrorException(
        'Unknown S3 ListObjectsCommand params',
      );
    }

    return result.Contents.map((item) => (item?.Key ? item.Key : ''));
  }

  async getSignedUrl(key: string, withCached = Boolean(true)): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: key,
    });

    if (!key) return '';

    try {
      const presignedUrl = await getSignedUrl(this._s3client, command, {
        expiresIn: this.PRE_SIGNED_URL_TTL,
      });

      let _presignUrlString = presignedUrl;

      if (withCached) {
        const objMeta = await this.getObjectHeaderMetadata(key);
        if (!objMeta) return '';

        const unixTimestamp = Math.round(
          objMeta.LastModified?.getTime() / 1000,
        );

        _presignUrlString = `${presignedUrl}&lastModified=${unixTimestamp}`;
      }

      return _presignUrlString;
    } catch (error) {
      this._log.error(`ERROR S3 get presign url: ${error}`);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<boolean> {
    const command = new DeleteObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: key,
    });

    try {
      const result = await this._s3client.send(command);

      return !!result.DeleteMarker;
    } catch (error) {
      this._log.error(`ERROR S3 Delete file: ${error}`);
      throw error;
    }
  }

  async deleteFileByDirectory(prefix: string): Promise<void> {
    const command = new ListObjectsV2Command({
      Bucket: this.S3_BUCKET,
      Prefix: prefix,
    });

    try {
      const listObjects = await this._s3client.send(command);

      if (!listObjects.Contents) return;
      if (listObjects.Contents.length == 0) return;

      if (listObjects.Contents.length > 0) {
        await Promise.all(
          listObjects.Contents.map(async (media: any) => {
            return await this.deleteFile(media.Key);
          }),
        );
      }

      if (listObjects.IsTruncated) {
        await this.deleteFileByDirectory(prefix);
      }

      this._log.verbose(`Success deleted S3 directory ${prefix}`);
    } catch (error) {
      this._log.error(`ERROR s3 Delete file by directory: ${error}`);
      throw error;
    }
  }
}
