import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StorageService } from './service/storage.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
