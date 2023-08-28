import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HashService } from './hash.service';

@Global()
@Module({
  providers: [
    {
      provide: 'HashService',
      useClass: HashService,
    },
    ConfigService,
  ],
  exports: [HashService],
  imports: [],
})
export class HashModule {}
