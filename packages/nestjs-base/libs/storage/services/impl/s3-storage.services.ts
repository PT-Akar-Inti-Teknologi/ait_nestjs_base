import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandOutput,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import * as node_path from 'path';
import { Readable } from 'stream';
import { StorageConfigS3 } from '../../interfaces/storage-config.interface';
import {
  IFile,
  IStorageRepository,
  StorageResponse,
} from '../../interfaces/storage-repository.interface';

export class S3StorageServices implements IStorageRepository {
  private S3_BUCKET: string;
  private S3_ROOT_FOLDER: string;
  private presignTtl: number; // ttl in seconds

  private _s3client: S3Client;
  private _log = new Logger(S3StorageServices.name);

  constructor(private config: StorageConfigS3) {
    this._s3client = new S3Client({
      credentials: {
        accessKeyId: this.config.s3Key,
        secretAccessKey: this.config.s3Secret,
      },
      region: this.config.s3Region,
      forcePathStyle: this.config.s3BucketPathStyle,
      endpoint: this.config.s3Endpoint,
    });

    this.S3_BUCKET = this.config.s3Bucket;
    this.S3_ROOT_FOLDER = this.config.s3RootFolder ?? 'dev-test';
    this.presignTtl = this.config.presignTtl ?? 7200;
  }

  getRootFolderName(): string {
    return this.S3_ROOT_FOLDER;
  }

  async uploadFile(file: IFile): Promise<StorageResponse> {
    const imageId = this.generateS3Dir(file.path, file.filename);

    const command = new PutObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: imageId,
      Body: file.buffer,
    });

    try {
      const result = await this._s3client
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
    } catch (error: any) {
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
    } catch (error: any) {
      this._log.error(`ERROR S3 Get file ${error}`);
      throw error;
    }
  }

  async getFilesFromDir(prefix: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: this.S3_BUCKET,
      Prefix: prefix,
    });

    try {
      const result = await this._s3client.send(command);

      if (!result?.Contents) {
        throw new InternalServerErrorException(
          'Unknown S3 ListObjectsCommand params',
        );
      }

      return result.Contents.map((item) => (item?.Key ? item.Key : ''));
    } catch (error: any) {
      this._log.error(`ERROR S3 Get files from dir ${error}`);
      throw error;
    }
  }

  async getObjectHeaderMetadata(key: string): Promise<HeadObjectCommandOutput> {
    const command = new HeadObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: key,
    });

    if (!key) return null;

    try {
      const objMetadata = await this._s3client.send(command);

      return objMetadata;
    } catch (error: any) {
      this._log.error(`ERROR S3 GET HeadObject ${error}`);
      return null;
    }
  }

  async getPresignedUrl(
    key: string,
    withCached = Boolean(true),
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: key,
    });

    if (!key) return '';

    try {
      const presignedUrl = await getSignedUrl(this._s3client, command, {
        expiresIn: this.presignTtl,
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
    } catch (error: any) {
      this._log.error(`ERROR S3 get presign url: ${error}`);
      throw error;
    }
  }

  async copyFile(fromKey: string, toKey: string): Promise<boolean> {
    const copyCommand = new CopyObjectCommand({
      Bucket: this.S3_BUCKET,
      CopySource: encodeURI(`${this.S3_BUCKET}/${fromKey}`),
      Key: toKey,
    });

    try {
      const copyData = await this._s3client.send(copyCommand);
      console.log('Object copied successfully:', copyData);
      return true;
    } catch (err) {
      console.error('Error:', err);
    }
    return false;
  }

  async moveFile(fromKey: string, toKey: string): Promise<boolean> {
    const copyCommand = new CopyObjectCommand({
      Bucket: this.S3_BUCKET,
      CopySource: encodeURI(`${this.S3_BUCKET}/${fromKey}`),
      Key: toKey,
    });

    try {
      const copyData = await this._s3client.send(copyCommand);
      console.log('Object copied successfully:', copyData);

      // Delete the original file
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.S3_BUCKET,
        Key: fromKey,
      });

      await this._s3client.send(deleteCommand);
      console.log('Original object deleted successfully');
      return true;
    } catch (err) {
      console.error('Error:', err);
    }
    return false;
  }

  async deleteFile(key: string): Promise<boolean> {
    const command = new DeleteObjectCommand({
      Bucket: this.S3_BUCKET,
      Key: key,
    });

    try {
      const result = await this._s3client.send(command);

      return result.DeleteMarker ? true : false;
    } catch (error: any) {
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
          listObjects.Contents.map(async (media) => {
            return await this.deleteFile(media.Key);
          }),
        );
      }

      if (listObjects.IsTruncated) {
        await this.deleteFileByDirectory(prefix);
      }

      this._log.verbose(`Success deleted S3 directory ${prefix}`);
    } catch (error: any) {
      this._log.error(`ERROR s3 Delete file by directory: ${error}`);
      throw error;
    }
  }

  async isFileExist(key: string): Promise<boolean> {
    return !!(await this.getObjectHeaderMetadata(key));
  }

  private parseFileName(url: string): string {
    return node_path.basename(url);
  }

  private generateS3Dir(pathDir: string, filename: string): string {
    return pathDir.replace(/^\/|\/$/g, '') + '/' + filename;
  }
}
