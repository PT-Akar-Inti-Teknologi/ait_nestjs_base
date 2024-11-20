import { Test, TestingModule } from '@nestjs/testing';
import { ResponseService } from '@pt-akar-inti-teknologi/nestjs-base';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { createMockRepository } from 'src/test/test-utils';
import { RolesDocument } from './entities/roles.entity';
import { ModulesService } from './modules.service';
import { ModulePermissionsDocument } from './entities/module-permissions.entity';

describe('ModulesService', () => {
  let service: ModulesService;
  let repo: jest.Mocked<Repository<RolesDocument>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<RolesDocument>>;

  beforeEach(async () => {
    [repo, queryBuilder] = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModulesService,
        ResponseService,
        {
          provide: getRepositoryToken(ModulePermissionsDocument),
          useValue: repo,
        },
      ],
    }).compile();

    service = await module.resolve<ModulesService>(ModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findMany should return correct value', async () => {
    repo.find.mockResolvedValueOnce([new RolesDocument()]);
    const result = await service.findMany();
    expect(result.length).toEqual(1);
  });
});
