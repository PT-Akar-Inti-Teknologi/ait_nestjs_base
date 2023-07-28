import { Module } from '@nestjs/common';

import { StorageService } from 'src/storage/service/StorageService';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
