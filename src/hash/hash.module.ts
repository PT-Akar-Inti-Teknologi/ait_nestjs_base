import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  imports: [ConfigModule.forRoot()],
})
export class HashModule {}
