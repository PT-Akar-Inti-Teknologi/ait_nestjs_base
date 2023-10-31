import { Module, DynamicModule, Global } from '@nestjs/common';
import { StorageServices } from './services/storage.services';
import {
  StorageConfig,
  StorageConfigImpls,
} from './interfaces/storage-config.interface';

@Global()
@Module({})
export class AitStorageModule {
  static register(config: StorageConfigImpls): DynamicModule {
    return {
      module: AitStorageModule,
      providers: [
        {
          provide: StorageConfig,
          useValue: config,
        },
        StorageServices,
      ],
      exports: [StorageServices],
    };
  }
}
