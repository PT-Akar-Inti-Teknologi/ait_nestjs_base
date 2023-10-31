import { StorageOptions } from '@google-cloud/storage';
type MappedClass<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};
export declare abstract class StorageConfig {
    driver: string;
}
export type StorageConfigImpls = StorageConfigFirebase | StorageConfigS3 | StorageConfigLocal;
export declare class StorageConfigFirebase extends StorageConfig {
    driver: 'firebase';
    /**
     * google cloud storage initialize options.
     * see https://googleapis.dev/nodejs/storage/latest/Storage.html for reference.
     * if not filled, will use GOOGLE_APPLICATION_CREDENTIALS environment variable
     *  */
    firebaseInitOptions?: StorageOptions;
    /** firebase storage bucket */
    firebaseBucket: string;
    constructor(options: MappedClass<StorageConfigFirebase>);
}
export declare class StorageConfigS3 extends StorageConfig {
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
}
export declare class StorageConfigLocal extends StorageConfig {
    driver: 'local';
    /** local driver dir to use, will use tmp if not specified */
    localDir?: string;
}
export {};
//# sourceMappingURL=storage-config.interface.d.ts.map