import { Test, TestingModule } from '@nestjs/testing';
import { MembersAddressService } from './members-address.service';
import { MessageService } from '@ait/nestjs-base';
import { ResponseService } from '@ait/nestjs-base';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MemberAddressDocument } from '../entities/member-address.entity';
import { Repository } from 'typeorm';
import { createMockRepository } from 'src/test/test-utils';

describe('MembersAddressService', () => {
  let service: MembersAddressService;
  let repo: jest.Mocked<Repository<MemberAddressDocument>>;

  beforeEach(async () => {
    [repo] = createMockRepository<MemberAddressDocument>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersAddressService,
        MessageService,
        ResponseService,
        {
          provide: getRepositoryToken(MemberAddressDocument),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get<MembersAddressService>(MembersAddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
