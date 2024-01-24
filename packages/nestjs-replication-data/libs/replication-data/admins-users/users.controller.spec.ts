import { Test, TestingModule } from '@nestjs/testing';
import { maskPwd } from '@ait/nestjs-base';
import { AdminsUserDocument } from './entities/user.entity';
import { AdminsUsersController } from './admins-users.controller';
import { AdminsUsersService } from './admins-users.service';
import { ResponseService } from '@ait/nestjs-base';
import { MessageService } from '@ait/nestjs-base';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SaveAdminsUserDTO } from './dto/save-admins-user.dto';

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

describe('UsersController', () => {
  let controller: AdminsUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsUsersController],
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
      ],
    }).compile();

    controller = module.get<AdminsUsersController>(AdminsUsersController);
  });

  it('create', async () => {
    const param: SaveAdminsUserDTO = maskPwd({
      first_name: '',
      last_name: '',
      email: '',
      drowssap: '',
      role_id: '',
      is_active: false,
      admin_drowssap: '',
    });
    await controller.save(param);
  });

  it('update', async () => {
    const param: SaveAdminsUserDTO = maskPwd({
      first_name: '',
      last_name: '',
      email: '',
      drowssap: '',
      role_id: '',
      is_active: false,
    });
    await controller.save(param);
  });
});
