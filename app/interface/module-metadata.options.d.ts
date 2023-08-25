import { ModuleMetadata } from '@nestjs/common';
export interface ModuleMetadataOptions extends ModuleMetadata {
    port?: string | number;
    autoCreate?: boolean;
}
