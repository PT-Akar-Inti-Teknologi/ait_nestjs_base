import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { MessageService } from '@ait/nestjs-base';
import { ResponseService } from '@ait/nestjs-base';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MemberDocument } from './entities/member.entity';
import {
  EntityManager,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { createMockRepository } from 'src/test/test-utils';
import { CreateMemberDTO } from './dto/create-member.dto';
import { UpdateMemberDTO } from './dto/update-member.dto';
import { MemberAddressDocument } from './entities/member-address.entity';
import { MembersAddressService } from './members-address/members-address.service';
import { CommonService } from '@ait/nestjs-base';
import { PostalCodesService } from 'src/regions/postal-codes/postal-codes.service';
import { GetMemberDTO } from './dto/member.dto';
import { StorageServices } from '@ait/nestjs-base';

describe('MembersService', () => {
  let service: MembersService;
  let repo: jest.Mocked<Repository<MemberDocument>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<MemberDocument>>;

  beforeEach(async () => {
    [repo, queryBuilder] = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        MessageService,
        ResponseService,
        {
          provide: getRepositoryToken(MemberDocument),
          useValue: repo,
        },
        {
          provide: getRepositoryToken(MemberAddressDocument),
          useValue: repo,
        },
        {
          provide: EntityManager,
          useValue: {
            transaction: jest.fn().mockImplementation((call) =>
              call({
                save: jest.fn().mockImplementation((value) => value),
              }),
            ),
          },
        },
      ],
    })
      .useMocker((token) => {
        if (token === MembersAddressService) {
          return {
            getAndValidateByField: jest.fn().mockResolvedValue({}),
          };
        }
        if (token === PostalCodesService) {
          return {
            getAndValidateById: jest.fn().mockResolvedValue({}),
          };
        }
        if (token === CommonService) {
          return {
            broadcastUpdate: jest.fn(),
            broadcastDelete: jest.fn(),
          };
        }
        if (token === StorageServices) {
          return {
            getRootFolderName: jest.fn().mockReturnValue(''),
            uploadFile: jest.fn().mockResolvedValue({ key: 'imageKey' }),
            getPresignedUrl: jest.fn().mockResolvedValue('presignedUrl'),
          };
        }
      })
      .compile();

    service = module.get<MembersService>(MembersService);
    repo = module.get<Repository<MemberDocument>>(
      getRepositoryToken(MemberDocument),
    ) as jest.Mocked<Repository<MemberDocument>>;
    queryBuilder = repo.createQueryBuilder() as jest.Mocked<
      SelectQueryBuilder<MemberDocument>
    >;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return correct value', async () => {
    queryBuilder.getManyAndCount.mockResolvedValueOnce([
      [new MemberDocument()],
      1,
    ]);
    const param = new GetMemberDTO();
    param.page = 1;
    param.size = 20;
    param.search = 'search';
    param.start_date = '2023';
    param.end_date = '2023';
    param.is_active = true;
    param.order = 'ASC';
    param.sort = 'name';
    expect(await service.findAll(param)).toEqual({
      content: [new MemberDocument()],
      pagination: {
        page: 1,
        total: 1,
        size: 20,
      },
    });
  });

  it('save should return correct value', async () => {
    const newMember = new CreateMemberDTO();
    newMember.address = 'address';
    repo.create.mockImplementation((entity) => entity as MemberDocument);
    const result = await service.save(newMember);
    expect(result.addresses[0].address).toEqual('address');
  });

  it('update should return correct value', async () => {
    // validate no duplicate
    queryBuilder.getOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    // old data mock
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as MemberDocument);
    const updatedMember = new UpdateMemberDTO();
    updatedMember.address = 'address';
    updatedMember.postal_code_id = 'postal_code_id';
    // new data
    repo.create.mockImplementation((entity) => entity as MemberDocument);
    const result = await service.update(updatedMember, 'id');
    expect(result.addresses[0].address).toEqual('address');
  });

  it('delete should return correct value', async () => {
    // check exist
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as MemberDocument);
    // delete mock
    repo.softDelete.mockResolvedValue(<UpdateResult>{
      affected: 1,
    });
    const result = await service.delete('id');
    // should be deleted
    expect(result.affected).toEqual(1);
  });

  it('newNoMember should return next generated number', async () => {
    // final data
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
      no_member: MemberDocument.PREFIX_NO_MEMBER + '000006',
    } as MemberDocument);
    const result = await service.newNoMember();
    // should be deleted
    expect(result).toEqual(MemberDocument.PREFIX_NO_MEMBER + '000007');
  });

  it('saveImage should return image key', async () => {
    const result = await service.saveImage('id', {} as any);
    // should be deleted
    expect(result).toEqual('imageKey');
  });

  it('getDetailAndValidateById should return include photo presigned url', async () => {
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
      photo: 'photo',
    } as MemberDocument);
    const result = await service.getDetailAndValidateById('id');
    // should be deleted
    expect(result).toEqual({
      id: 'id',
      photo: 'presignedUrl',
    });
  });
});
