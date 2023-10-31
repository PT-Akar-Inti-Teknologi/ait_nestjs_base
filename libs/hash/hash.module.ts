import { DynamicModule, Global, Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { HashModuleConfig } from './interface/hash-module-config.interface';

@Global()
@Module({})
export class AitHashModule {
  static register(config: HashModuleConfig): DynamicModule {
    return {
      module: AitHashModule,
      providers: [{ provide: HashModuleConfig, useValue: config }, HashService],
      exports: [HashService],
      imports: [],
    };
  }
}
