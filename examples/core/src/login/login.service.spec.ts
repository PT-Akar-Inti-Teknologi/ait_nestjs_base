import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, HashService, MessageService } from '@pt-akar-inti-teknologi/nestjs-base';
import { ResponseService } from '@pt-akar-inti-teknologi/nestjs-base';
import { LoginService } from './login.service';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';

jest.mock('fs', () => {
  const actual = jest.requireActual('fs');
  return {
    ...actual,
    readFileSync: jest.fn().mockReturnValue('{{ title }}|{{ description }}'),
  };
});

describe('LoginService', () => {
  let service: LoginService;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        MessageService,
        ResponseService,
        {
          provide: HashService,
          useValue: {
            bcryptComparePassword: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: AuthService,
          useValue: {
            generateToken: jest.fn().mockResolvedValue({
              token: 'token',
              refreshtoken: 'refreshtoken',
            }),
            generateAccessToken: jest
              .fn()
              .mockResolvedValue({ token: 'token' }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    usersService = module.get<jest.Mocked<UsersService>>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('loginByEmail should return correct value', async () => {
    let error: any;
    let result: any;
    try {
      result = await service.loginByEmail(new LoginDTO());
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
    expect(result).toEqual({
      token: 'token',
      refreshtoken: 'refreshtoken',
    });
  });

  it('loginByEmail should throw when admin not found', async () => {
    let error: any;
    usersService.findOneByEmail.mockResolvedValueOnce(null);
    try {
      await service.loginByEmail(new LoginDTO());
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });

  it('loginByEmail should throw when admin not active', async () => {
    let error: any;
    usersService.findOneByEmail.mockResolvedValueOnce({
      is_active: false,
    } as any);
    try {
      await service.loginByEmail(new LoginDTO());
    } catch (e) {
      error = e;
    }
    expect(error).not.toBeUndefined();
  });

  it('refreshToken should return correct value', async () => {
    expect(await service.refreshToken({ id: 'id' } as any)).toEqual({
      token: 'token',
    });
  });
});
