import { Test, TestingModule } from '@nestjs/testing';
import { UserRolesService } from './user-roles.service';
import { MessageService } from '@ait/nestjs-base';
import { ResponseService } from '@ait/nestjs-base';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { createMockRepository } from 'src/test/test-utils';
import { GetUserRolesDTO } from './dto/get-user-roles.dto';
import { RolesDocument } from './entities/roles.entity';
import { AuthPermissionsService } from 'src/auth/auth-permissions.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserRolesDTO } from './dto/create-user-roles.dto';
import { UpdateUserRolesDTO } from './dto/update-user-roles.dto';
import { UserDocument } from 'src/users/entities/user.entity';

describe('UserRolesService', () => {
  let service: UserRolesService;
  let usersService: jest.Mocked<UsersService>;
  let repo: jest.Mocked<Repository<RolesDocument>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<RolesDocument>>;

  beforeEach(async () => {
    [repo, queryBuilder] = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRolesService,
        MessageService,
        ResponseService,
        {
          provide: getRepositoryToken(RolesDocument),
          useValue: repo,
        },
        {
          provide: AuthPermissionsService,
          useValue: {
            broadcastUpdate: jest.fn(),
            broadcastDelete: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = await module.resolve<UserRolesService>(UserRolesService);
    usersService = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return correct value', async () => {
    queryBuilder.getManyAndCount.mockResolvedValueOnce([
      [new RolesDocument()],
      1,
    ]);
    const param = new GetUserRolesDTO();
    param.page = 1;
    param.size = 20;
    param.search = 'search';
    param.order = 'ASC';
    param.sort = 'name';
    const result = await service.findAll(param);
    expect(result.pagination.page).toEqual(1);
    expect(result.content.length).toEqual(1);
  });

  it('getAndValidateById should return correct value', async () => {
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    const result = await service.getAndValidateById('id');
    expect(result).toEqual({
      id: 'id',
    });
  });

  it('getAndValidateById should throw if not found', async () => {
    queryBuilder.getOne.mockResolvedValueOnce(null);
    const call = () => service.getAndValidateById('id');
    expect(call).rejects.toThrow();
  });

  it('save should return correct value', async () => {
    const savedUserRole = new CreateUserRolesDTO();
    savedUserRole.name = 'name';
    savedUserRole.roles_module_permissions = [
      {
        active_permissions: ['create', 'read'],
        module_permission: { code: 'code' },
      } as any,
    ];
    queryBuilder.getOne.mockResolvedValueOnce(savedUserRole as any);
    repo.save.mockImplementation((entity) => entity as any);
    const result = await service.save(savedUserRole);
    expect(result.name).toEqual('name');
  });

  it('save should throw when validation error', async () => {
    const call = () => service.save(new CreateUserRolesDTO());
    await expect(call).rejects.toThrow();
  });

  it('update should return correct value', async () => {
    const savedUserRole = new UpdateUserRolesDTO();
    savedUserRole.name = 'name';
    savedUserRole.roles_module_permissions = [
      {
        active_permissions: ['create', 'read'],
        module_permission: { code: 'code' },
      } as any,
    ];
    queryBuilder.getOne.mockResolvedValue(savedUserRole as any);
    repo.save.mockImplementation((entity) => entity as any);
    const result = await service.update(savedUserRole, 'id');
    expect(result.name).toEqual('name');
  });

  it('update should throw when validation error', async () => {
    const call = () => service.update(new UpdateUserRolesDTO(), 'id');
    await expect(call).rejects.toThrow();
  });

  it('delete should return correct value', async () => {
    // check exist
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    // delete mock
    repo.softRemove.mockResolvedValue({} as any);
    usersService.findAll.mockResolvedValue({
      count: 0,
      list: [],
    });
    const result = await service.delete('id');
    expect(result.affected).toEqual(1);
  });

  it('delete should throw when user exist', async () => {
    usersService.findAll.mockResolvedValue({
      count: 1,
      list: [new UserDocument()],
    });
    const call = () => service.update(new UpdateUserRolesDTO(), 'id');
    await expect(call).rejects.toThrow();
  });
});
