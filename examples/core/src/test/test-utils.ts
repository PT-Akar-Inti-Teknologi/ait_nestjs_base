import { ConfigModule } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { INestApplication, ModuleMetadata } from '@nestjs/common';
import { DataSource, DataSourceOptions, getMetadataArgsStorage } from 'typeorm';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';

export function createMockRepository<T>(): [
  jest.Mocked<Repository<T>>,
  jest.Mocked<SelectQueryBuilder<T>>,
] {
  const queryBuilderMock = {
    where: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    withDeleted: jest.fn().mockReturnThis(),
    addGroupBy: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    getCount: jest.fn(),
    getMany: jest.fn(),
    getManyAndCount: jest.fn(),
    getOne: jest.fn(),
    getRawOne: jest.fn(),
    execute: jest.fn(),
  };
  const repo = {
    save: jest.fn(),
    softDelete: jest.fn(),
    softRemove: jest.fn(),
    createQueryBuilder: jest.fn(() => queryBuilderMock),
    find: jest.fn(),
    findByIds: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    metadata: {
      ownRelations: [
        {
          propertyName: '123',
          propertyPath: '',
        },
      ],
      relations: [
        {
          propertyName: '123',
          propertyPath: '',
        },
      ],
    },
    manager: {
      query: jest.fn(),
      connection: {
        getRepository: jest.fn().mockImplementation(() => repo),
      },
    },
  } as any;
  return [repo, queryBuilderMock as any];
}

/**
 * Function to ignore relation of entity during mock modules
 *
 * @param target {Function | T}
 * @param propertyNames {string[]}
 * @return {T}
 */
export function ignoreRelationsOf<T extends object>(
  target: T,
  propertyNames: string[],
): T {
  Reflect.defineMetadata('ignoreRelations', propertyNames, target);

  return target;
}

/**
 * Create mock module and in memory database
 *
 * @param moduleMetadata
 * @param dataSourceOptions
 */
export async function mockModules(
  moduleMetadata: Partial<ModuleMetadata> = {},
  dataSourceOptions: Partial<DataSourceOptions> = {},
): Promise<[TestingModule, INestApplication, DataSource]> {
  const dataSource: DataSource = new DataSource({
    ...dataSourceOptions,
    type: 'better-sqlite3',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    incompatibleColumnType: {
      timestamptz: 'datetime',
      enum: 'varchar',
    },
  } as any);

  const module: TestingModule = await Test.createTestingModule({
    ...moduleMetadata,
    imports: [
      ConfigModule.forRoot(),
      TypeOrmModule.forRootAsync({
        dataSourceFactory: (
          (incompatibleColumnType: any = {}) =>
          () => {
            const metadataArgsStorage = getMetadataArgsStorage();
            (metadataArgsStorage as any).relations =
              metadataArgsStorage.relations.filter((r) => {
                return !(
                  Reflect.getMetadata('ignoreRelations', r.target as any) || []
                ).includes(r.propertyName);
              });

            metadataArgsStorage.columns.forEach((c) => {
              if (incompatibleColumnType[c?.options?.type as string]) {
                c.options.type =
                  incompatibleColumnType[c.options.type as string];
              }
            });

            return Promise.resolve(dataSource);
          }
        )((dataSource.options as any).incompatibleColumnType),
        useClass: class implements TypeOrmOptionsFactory {
          createTypeOrmOptions(): TypeOrmModuleOptions {
            return dataSource.options;
          }
        },
      }),
      ...(moduleMetadata.imports || []),
    ],
    controllers: [...(moduleMetadata.controllers || [])],
    providers: [
      {
        provide: DataSource,
        useFactory: () => dataSource,
      },
      ...(moduleMetadata.providers || []),
    ],
  }).compile();

  return [module, await module.createNestApplication().init(), dataSource];
}
