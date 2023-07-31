import { INestApplication, Logger } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
export declare class AppFactory {
    protected app: INestApplication;
    protected readonly logger: Logger;
    protected setApplicationContext(app: INestApplication): void;
}
export interface ModuleMetadataOptions extends ModuleMetadata {
    port?: string | number;
}
/**
 * Main application bootstrap
 *
 * @param metadata {ModuleMetadataOptions}
 * @constructor
 */
export declare function Application(metadata?: ModuleMetadataOptions): (Clazz: any) => void;
