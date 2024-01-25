import { Injectable } from '@nestjs/common';
import { BaseService, MessageService, ResponseService } from '@ait/nestjs-base';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateMembersAddressDTO,
  UpdateMembersAddressDTO,
} from './dto/members-address.dto';
import { MemberAddressDocument } from '../entities/member-address.entity';

@Injectable()
export class MembersAddressService extends BaseService<
  CreateMembersAddressDTO,
  UpdateMembersAddressDTO,
  MemberAddressDocument
> {
  constructor(
    @InjectRepository(MemberAddressDocument)
    public memberAddressRepository: Repository<MemberAddressDocument>,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {
    super(
      memberAddressRepository,
      responseService,
      messageService,
      MembersAddressService.name,
    );

    this.relations = [
      'addresses.members',
      'addresses.postal_code',
      'postal_code.city',
      'city.province',
      'province.country',
    ];
    this.tableAlias = 'addresses';
    this.searchByFields = ['addresses.address'];
  }
}
