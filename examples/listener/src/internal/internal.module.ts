import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MemberAddressDocument } from './entities/member-address.entity';
import { MemberDocument } from './entities/member.entity';
import { InternalController } from './internal.controller';
import { InternalService } from './internal.service';

import { MemberDocumentSubscriber } from './subscriber/member.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([MemberAddressDocument, MemberDocument])],
  controllers: [InternalController],
  exports: [InternalService],
  providers: [InternalService, MemberDocumentSubscriber],
})
export class InternalModule {}
