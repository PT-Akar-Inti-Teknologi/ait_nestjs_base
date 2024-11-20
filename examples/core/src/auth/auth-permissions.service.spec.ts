import { Test, TestingModule } from '@nestjs/testing';
import { AuthPermissionsService } from './auth-permissions.service';
import { CommonService, MessageService } from '@pt-akar-inti-teknologi/nestjs-base';
import { ResponseService } from '@pt-akar-inti-teknologi/nestjs-base';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PermissionDocument } from 'src/auth/entities/permission.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { createMockRepository } from 'src/test/test-utils';
import { SavePermissionDTO } from 'src/auth/dto/save-permission.dto';
import { MainPagingDTO } from '@pt-akar-inti-teknologi/nestjs-base';
import { UpdatePermissionDTO } from './dto/update-permission.dto';

describe('AuthPermissionsService', () => {
  let service: AuthPermissionsService;
  let commonService: jest.Mocked<CommonService>;
  let repo: jest.Mocked<Repository<PermissionDocument>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<PermissionDocument>>;

  beforeEach(async () => {
    [repo, queryBuilder] = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthPermissionsService,
        MessageService,
        ResponseService,
        {
          provide: getRepositoryToken(PermissionDocument),
          useValue: repo,
        },
      ],
    })
      .useMocker((token) => {
        if (token === CommonService) {
          return {
            postHttp: jest.fn(),
          };
        }
      })
      .compile();

    service = module.get<AuthPermissionsService>(AuthPermissionsService);
    commonService = module.get<CommonService>(
      CommonService,
    ) as jest.Mocked<CommonService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('save should return correct value', async () => {
    queryBuilder.getOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({} as any);
    const newUser = new SavePermissionDTO();
    newUser.role_id = 'role_id';
    repo.save.mockImplementation((entity) => entity as any);
    const result = await service.save(newUser);
    expect(result.role_id).toEqual('role_id');
  });

  it('save should throw when validation error', async () => {
    repo.save.mockRejectedValue(new Error());
    const newUser = new SavePermissionDTO();
    newUser.role_id = 'role_id';
    const call = () => service.save(newUser);
    await expect(call).rejects.toThrow();
  });

  it('findAll should return correct value', async () => {
    queryBuilder.getManyAndCount.mockResolvedValueOnce([
      [new PermissionDocument()],
      1,
    ]);
    const param = new MainPagingDTO();
    param.page = 1;
    param.size = 20;
    param.search = 'search';
    param.order = 'ASC';
    param.sort = 'name';
    expect(await service.findAll(param)).toEqual({
      list: [new PermissionDocument()],
      count: 1,
    });
  });

  it('findAll should throw when query error', async () => {
    queryBuilder.getManyAndCount.mockRejectedValue(new Error());
    const param = new MainPagingDTO();
    const call = () => service.findAll(param);
    await expect(call).rejects.toThrow();
  });

  it('findOne should return correct value', async () => {
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    const result = await service.findOne('id');
    expect(result).toEqual({
      id: 'id',
    });
  });

  it('findOne should throw when query error', async () => {
    queryBuilder.getOne.mockRejectedValue(new Error());
    const call = () => service.findOne('id');
    await expect(call).rejects.toThrow();
  });

  it('update should return correct value', async () => {
    // old data mock
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    // validate no duplicate
    queryBuilder.getOne.mockResolvedValueOnce(null);
    // send email
    queryBuilder.getOne.mockResolvedValueOnce({} as any);
    const updatedUser = new UpdatePermissionDTO();
    updatedUser.role_id = 'role_id';
    // new data
    repo.save.mockImplementation((entity) => entity as any);
    const result = await service.update('id', updatedUser);
    expect(result.role_id).toEqual('role_id');
  });

  it('update should throw when validation error', async () => {
    const call = () => service.update('id', new UpdatePermissionDTO());
    await expect(call).rejects.toThrow();
  });

  it('remove should return correct value', async () => {
    // check exist
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    // delete mock
    repo.softRemove.mockResolvedValue({} as any);
    const result = await service.remove('id');
    expect(result.affected).toEqual(1);
  });

  it('remove should throw when validation error', async () => {
    const call = () => service.remove('id');
    await expect(call).rejects.toThrow();
  });

  it('getAndValidate should return correct value', async () => {
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    const result = await service.getAndValidate('id');
    expect(result).toEqual({
      id: 'id',
    });
  });

  it('getAndValidate should throw when not found', async () => {
    const call = () => service.getAndValidate('id');
    await expect(call).rejects.toThrow();
  });

  it('broadcastUpdate should broadcast update and return correct value', async () => {
    repo.save.mockImplementation((entity) => entity as any);
    const result = await service.broadcastUpdate(new SavePermissionDTO());
    await new Promise(process.nextTick);
    expect(commonService.postHttp).toBeCalled();
    expect(result).toEqual({});
  });

  it('broadcastUpdate should throw when save faild', async () => {
    repo.save.mockRejectedValue(new Error());
    const call = () => service.broadcastUpdate(new SavePermissionDTO());
    await expect(call).rejects.toThrow();
  });
});
