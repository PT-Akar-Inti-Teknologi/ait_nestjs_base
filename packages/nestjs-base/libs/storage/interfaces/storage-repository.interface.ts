import { Readable } from 'stream';

export interface StorageResponse {
  tag: string;
  key: string;
  bucket: string;
}

export interface IFile {
  buffer: Buffer;
  path: string;
  filename: string;
}

export interface IStorageRepository {
  getRootFolderName(): string;

  uploadFile(file: IFile): Promise<StorageResponse>;

  getFile(key: string): Promise<Readable>;

  getFilesFromDir(prefix: string): Promise<string[]>;

  getPresignedUrl(key: string, withCached?: boolean): Promise<string>;

  deleteFile(key: string): Promise<boolean>;

  deleteFileByDirectory(prefix: string): Promise<void>;

  copyFile(fromKey: string, toKey: string): Promise<boolean>;

  moveFile(fromKey: string, toKey: string): Promise<boolean>;

  isFileExist(key: string): Promise<boolean>;
}
