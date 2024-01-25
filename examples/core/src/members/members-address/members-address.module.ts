import { Module } from '@nestjs/common';
import { MembersAddressService } from './members-address.service';
import { MembersAddressController } from './members-address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { MemberAddressDocument } from '../entities/member-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberAddressDocument]), HttpModule],
  controllers: [MembersAddressController],
  providers: [MembersAddressService],
})
export class MembersAddressModule {}
