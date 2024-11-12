import { StorageOptions } from '@google-cloud/storage';

type MappedClass<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

export abstract class StorageConfig {
  driver: string;

  /** presign url ttl in seconds */
  presignTtl?: number;
}

export type StorageConfigImpls =
  | StorageConfigFirebase
  | StorageConfigS3
  | StorageConfigLocal;

export class StorageConfigFirebase extends StorageConfig {
  driver: 'firebase';
  /**
   * google cloud storage initialize options.
   * see https://googleapis.dev/nodejs/storage/latest/Storage.html for reference.
   * if not filled, will use GOOGLE_APPLICATION_CREDENTIALS environment variable
   *  */
  firebaseInitOptions?: StorageOptions;
  /** firebase storage bucket */
  firebaseBucket: string;

  constructor(options: MappedClass<StorageConfigFirebase>) {
    super();
    Object.assign(this, options);
  }
}

export class StorageConfigS3 extends StorageConfig {
  driver: 's3';
  /** s3 key ID */
  s3Key: string;
  /** s3 secret access key */
  s3Secret: string;
  /** s3 region */
  s3Region: string;
  /** s3 bucket */
  s3Bucket: string;
  /** s3 root folder to use, will use dev-test if not specified */
  s3RootFolder?: string;
  /** s3 endpoint, only for compatible mode (OSS, firebase, digitalocean, etc, minIO) */
  s3Endpoint?: string;
  /** for compatible mode that doesn't support subdomain bucket style (example: minIO). default to false in s3 config */
  s3BucketPathStyle?: boolean;
}

export class StorageConfigLocal extends StorageConfig {
  driver: 'local';
  /** local driver dir to use, will use tmp if not specified */
  localDir?: string;
}
