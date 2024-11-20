import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberDocument } from './entities/member.entity';
import { HttpModule } from '@nestjs/axios';
import { MemberAddressDocument } from './entities/member-address.entity';
import { MembersAddressModule } from './members-address/members-address.module';
import { ImageValidationService } from '@pt-akar-inti-teknologi/nestjs-base';
import { MembersAddressService } from './members-address/members-address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemberDocument, MemberAddressDocument]),
    MembersAddressModule,
    HttpModule,
  ],
  controllers: [MembersController],
  providers: [MembersService, MembersAddressService, ImageValidationService],
  exports: [MembersService],
})
export class MembersModule {}
