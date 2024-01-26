import { Test, TestingModule } from '@nestjs/testing';
import { maskPwd } from '@ait/nestjs-base';
import { AdminsUserDocument } from './entities/user.entity';
import { AdminsUsersService } from './admins-users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResponseService } from '@ait/nestjs-base';
import { MessageService } from '@ait/nestjs-base';
import { SaveAdminsUserDTO } from './dto/save-admins-user.dto';
import { DeleteAdminsUserDTO } from './dto/delete-admins-user.dto';

const userRole = {
  created_at: '2023-01-19T05:20:54.748Z',
  updated_at: '2023-01-19T05:20:54.748Z',
  deleted_at: null,
  id: '5ef5f54e-b5db-4602-83c2-b04c1c729ef6',
  name: 'ADMIN',
  status: 'ACTIVE',
  is_all_access: false,
  module_permissions: [
    {
      created_at: '2023-01-19T05:20:54.748Z',
      updated_at: '2023-01-19T05:20:54.748Z',
      deleted_at: null,
      id: '3ddd83f8-f042-4ea6-a5e7-b71b7fc5fc57',
      module_id: 'b2794da2-c74f-4a43-9c09-da13687bdee1',
      active_permissions: ['CREATE', 'DELETE', 'UPDATE', 'READ'],
      parent_id: null,
      role_id: '5ef5f54e-b5db-4602-83c2-b04c1c729ef6',
      module: {
        created_at: '2023-01-18T01:34:57.406Z',
        updated_at: '2023-01-18T01:34:57.406Z',
        deleted_at: null,
        id: 'b2794da2-c74f-4a43-9c09-da13687bdee1',
        name: 'Permissions',
        code: 'PERMISSION',
        permissions: ['CREATE', 'DELETE', 'UPDATE', 'READ'],
        parent_id: null,
      },
      sub_module_permissions: [
        {
          created_at: '2023-01-19T05:20:54.748Z',
          updated_at: '2023-01-19T05:20:54.748Z',
          deleted_at: null,
          id: '33d3390f-652d-4ecc-a98f-e4b3170d86a5',
          module_id: '7fe698d0-746b-4cc1-9178-f3d4d0dbb91b',
          active_permissions: ['CREATE', 'DELETE', 'UPDATE', 'READ'],
          parent_id: '3ddd83f8-f042-4ea6-a5e7-b71b7fc5fc57',
          role_id: null,
          module: {
            created_at: '2023-01-18T01:34:57.406Z',
            updated_at: '2023-01-18T01:34:57.406Z',
            deleted_at: null,
            id: '7fe698d0-746b-4cc1-9178-f3d4d0dbb91b',
            name: 'All Users',
            code: 'ALL_USERS',
            permissions: ['CREATE', 'DELETE', 'UPDATE', 'READ'],
            parent_id: 'b2794da2-c74f-4a43-9c09-da13687bdee1',
          },
        },
        {
          created_at: '2023-01-19T05:20:54.748Z',
          updated_at: '2023-01-19T05:20:54.748Z',
          deleted_at: null,
          id: '54c19b19-f313-4b66-88d0-1465bfc95fd2',
          module_id: 'efa9a396-e284-4570-923d-c01a7bfe4efc',
          active_permissions: ['CREATE', 'DELETE', 'UPDATE', 'READ'],
          parent_id: '3ddd83f8-f042-4ea6-a5e7-b71b7fc5fc57',
          role_id: null,
          module: {
            created_at: '2023-01-18T01:34:57.406Z',
            updated_at: '2023-01-18T01:34:57.406Z',
            deleted_at: null,
            id: 'efa9a396-e284-4570-923d-c01a7bfe4efc',
            name: 'User Roles',
            code: 'USER_ROLES',
            permissions: ['CREATE', 'DELETE', 'UPDATE', 'READ'],
            parent_id: 'b2794da2-c74f-4a43-9c09-da13687bdee1',
          },
        },
      ],
    },
  ],
};

const users: AdminsUserDocument[] = maskPwd([
  {
    id: '72ebcf0c-4072-4332-bd21-548cccd1ffce',
    first_name: 'Ronald 2',
    last_name: 'Arie 2',
    email: 'ronald32@akarinti.tech',
    drowssap: 'iub752hbd2',
    role_id: '12',
    is_active: false,
    created_at: '2023-01-17T04:24:01.053Z',
    updated_at: '2023-01-17T05:12:02.364Z',
    deleted_at: null,
  },
  {
    id: 'b356805e-fa46-4ea1-bcad-fdd88b9928f8',
    first_name: 'Ronald',
    last_name: 'Arie',
    email: 'ronald@akarinti.tech',
    drowssap: 'iub752hbd',
    role_id: '1',
    is_active: true,
    created_at: '2023-01-17T04:23:33.920Z',
    updated_at: '2023-01-17T04:23:33.920Z',
    deleted_at: null,
  },
]);

describe('UsersService', () => {
  let service: AdminsUsersService;
  // let userRepo: getRepositoryToken(AdminsUserDocument);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminsUsersService,
        ResponseService,
        MessageService,
        {
          provide: getRepositoryToken(AdminsUserDocument),
          useValue: {
            save: jest.fn().mockResolvedValue(users[0]),
            update: jest.fn().mockResolvedValue(users[0]),
            findOne: jest.fn().mockResolvedValue(users[0]),
            getManyAndCount: jest.fn().mockRejectedValue(users),
            createQueryBuilder: jest.fn(() => ({
              delete: jest.fn().mockReturnThis(),
              innerJoinAndSelect: jest.fn().mockReturnThis(),
              innerJoin: jest.fn().mockReturnThis(),
              from: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              execute: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getManyAndCount: jest.fn().mockReturnThis(),
            })),
          },
        },
        // {
        //   provide: UserRolesService,
        //   useValue: {
        //     getAndValidate: jest.fn().mockResolvedValue(userRole),
        //   },
        // },
      ],
    }).compile();

    service = module.get<AdminsUsersService>(AdminsUsersService);
    // userRepo = module.get<UserRepository>(UserRepository);
  });

  it('create', async () => {
    const paramUser: SaveAdminsUserDTO = maskPwd({
      first_name: '',
      last_name: '',
      email: '',
      drowssap: '',
      role_id: '',
      is_active: true,
      admin_drowssap: '',
    });
    const user = await service.save(paramUser);
    expect(Object.keys(user)).toEqual(
      expect.arrayContaining(Object.keys(AdminsUserDocument)),
    );
  });

  it('delete', async () => {
    const paramUser: DeleteAdminsUserDTO = {
      user_id: '',
    };
    const user = await service.delete(paramUser.user_id);
    expect(Object.keys(user)).toEqual(
      expect.arrayContaining(Object.keys(AdminsUserDocument)),
    );
  });

  // handle try catch
  it('error create', async () => {
    jest.resetAllMocks();
    const paramUser: SaveAdminsUserDTO = maskPwd({
      first_name: '',
      last_name: '',
      email: '',
      drowssap: '',
      role_id: '',
      is_active: true,
      admin_drowssap: '',
    });
    try {
      await service.save(paramUser);
    } catch (error: any) {
      expect(['response_schema', 'response_output']).toEqual(
        Object.keys(error.response ?? {}),
      );
    }
  });

  it('error update', async () => {
    jest.resetAllMocks();
    try {
      const paramUser: DeleteAdminsUserDTO = {
        user_id: '',
      };
      await service.delete(paramUser.user_id);
    } catch (error: any) {
      expect(['response_schema', 'response_output']).toEqual(
        Object.keys(error.response ?? {}),
      );
    }
  });
});
