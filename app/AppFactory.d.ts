import { INestApplication, Logger } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';
import { ModuleMetadataOptions } from './interface/ModuleMetadataOptions';
export declare class AppFactory {
    protected app: INestApplication;
    protected readonly logger: Logger;
    protected setApplicationContext(app: INestApplication): Promise<void>;
}
/**
 * Resolve import with inject providers to imports module
 * @param metadata {ModuleMetadata}
 */
export declare function resolveImportProviders(metadata: ModuleMetadata): void;
/**
 * Get list of ModuleMetadata
 * @param Clazz
 */
export declare function getModuleMetadata(Clazz: any): ModuleMetadata;
/**
 * Main application bootstrap
 * Auto load ConfigModule in any imports Metadata
 *
 * @param metadata {ModuleMetadataOptions}
 * @constructor
 */
export declare function Application(metadata: ModuleMetadataOptions): ClassDecorator;
