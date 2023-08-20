import { Module } from '@nestjs/common';

import { StorageService } from './service/StorageService';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
