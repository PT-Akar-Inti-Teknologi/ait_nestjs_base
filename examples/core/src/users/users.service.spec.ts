import { EmailService } from '@ait/nest-notification';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService, CommonService, HashService, MessageService, ResponseService } from '@pt-akar-inti-teknologi/nestjs-base';
import { createMockRepository } from 'src/test/test-utils';
import { UserRolesService } from 'src/user-role/user-roles.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { GetUserDTO } from './dto/get-user.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { VerificationTokenDTO } from './dto/verification-token.dto';
import { UserDocument } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let emailService: jest.Mocked<EmailService>;
  let commonService: jest.Mocked<CommonService>;
  let repo: jest.Mocked<Repository<UserDocument>>;
  let queryBuilder: jest.Mocked<SelectQueryBuilder<UserDocument>>;

  beforeEach(async () => {
    [repo, queryBuilder] = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        MessageService,
        ResponseService,
        {
          provide: getRepositoryToken(UserDocument),
          useValue: repo,
        },
      ],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            generateToken: jest.fn().mockResolvedValue({ token: 'token' }),
          };
        }
        if (token === UserRolesService) {
          return {
            getAndValidate: jest.fn().mockResolvedValue({}),
          };
        }
        if (token === EmailService) {
          return {
            send: jest.fn(),
          };
        }
        if (token === CommonService) {
          return {
            postHttp: jest.fn(),
          };
        }
        if (token === HashService) {
          return {
            bcryptComparePassword: jest.fn().mockResolvedValue(true),
            generateHashPassword: jest.fn().mockResolvedValue('new_password'),
          };
        }
      })
      .compile();

    service = module.get<UsersService>(UsersService);
    emailService = module.get<EmailService>(
      EmailService,
    ) as jest.Mocked<EmailService>;
    commonService = module.get<CommonService>(
      CommonService,
    ) as jest.Mocked<CommonService>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should send email, broadcast update and return correct value', async () => {
    queryBuilder.getOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({} as any);
    const newUser = new CreateUserDTO();
    newUser.email = 'email';
    newUser.password = 'mock';
    repo.save.mockImplementation((entity) => entity as any);
    const result = await service.create(newUser);
    expect(result.email).toEqual('email');
    await new Promise(process.nextTick);
    expect(emailService.send).toBeCalledTimes(1);
    expect(commonService.postHttp).toBeCalled();
  });

  it('create should throw when validation error', async () => {
    queryBuilder.getOne.mockRejectedValue(new Error());
    const newUser = new CreateUserDTO();
    newUser.email = 'email';
    newUser.password = 'mock';
    repo.save.mockImplementation((entity) => entity as any);
    const call = () => service.create(newUser);
    await expect(call).rejects.toThrow();
  });

  it('findAll should return correct value', async () => {
    queryBuilder.getManyAndCount.mockResolvedValueOnce([
      [new UserDocument()],
      1,
    ]);
    const param = new GetUserDTO();
    param.page = 1;
    param.size = 20;
    param.search = 'search';
    param.is_active = true;
    param.order = 'ASC';
    param.sort = 'name';
    expect(await service.findAll(param)).toEqual({
      list: [new UserDocument()],
      count: 1,
    });
  });

  it('findAll should throw when query error', async () => {
    queryBuilder.getManyAndCount.mockRejectedValue(new Error());
    const param = new GetUserDTO();
    const call = () => service.findAll(param);
    await expect(call).rejects.toThrow();
  });

  it('findOneByEmail should return correct value', async () => {
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    const result = await service.findOneByEmail('id');
    expect(result).toEqual({
      id: 'id',
    });
  });

  it('findOneByEmail should throw when query error', async () => {
    queryBuilder.getOne.mockRejectedValue(new Error());
    const call = () => service.findOneByEmail('id');
    await expect(call).rejects.toThrow();
  });

  it('update should send email, broadcast update, and return correct value', async () => {
    // old data mock
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as UserDocument);
    // validate no duplicate
    queryBuilder.getOne.mockResolvedValueOnce(null);
    // send email
    queryBuilder.getOne.mockResolvedValueOnce({} as any);
    const updatedUser = new UpdateUserDTO();
    updatedUser.email = 'email';
    updatedUser.role_id = 'role_id';
    // new data
    repo.save.mockImplementation((entity) => entity as any);
    const result = await service.update('id', updatedUser);
    expect(result.email).toEqual('email');
    await new Promise(process.nextTick);
    expect(emailService.send).toBeCalledTimes(1);
    expect(commonService.postHttp).toBeCalled();
  });

  it('update should throw when validation error', async () => {
    const call = () => service.update('id', new UpdateUserDTO());
    await expect(call).rejects.toThrow();
  });

  it('remove should return correct value', async () => {
    // check exist
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as UserDocument);
    // delete mock
    repo.softRemove.mockResolvedValue({} as any);
    const result = await service.remove('id', new DeleteUserDTO());
    expect(result.affected).toEqual(1);
  });

  it('remove should throw when validation error', async () => {
    const call = () => service.remove('id', new DeleteUserDTO());
    await expect(call).rejects.toThrow();
  });

  it('myProfile should return correct value', async () => {
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    const result = await service.myProfile('id');
    expect(result).toEqual({
      id: 'id',
    });
  });

  it('myProfile should throw when query error', async () => {
    queryBuilder.getOne.mockRejectedValue(new Error());
    const call = () => service.myProfile('id');
    await expect(call).rejects.toThrow();
  });

  it('sendVerificationLink should send email when success', async () => {
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    await service.sendVerificationLink('id');
    await new Promise(process.nextTick);
    expect(emailService.send).toBeCalledTimes(1);
  });

  it('sendVerificationLink should throw when validation error', async () => {
    const call = () => service.sendVerificationLink('id');
    await expect(call).rejects.toThrow();
  });

  it('forgotPassword should send email and save user when success', async () => {
    queryBuilder.getOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    repo.save.mockResolvedValueOnce({
      id: 'id',
    } as any);
    await service.forgotPassword(new ForgotPasswordDTO());
    await new Promise(process.nextTick);
    expect(emailService.send).toBeCalledTimes(1);
  });

  it('forgotPassword should throw when validation error', async () => {
    const call = () => service.forgotPassword(new ForgotPasswordDTO());
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

  it('sendEmailVerificationLink should throw when mail service fails', async () => {
    emailService.send.mockRejectedValue(new Error());
    const call = () => service.sendEmailVerificationLink(new UserDocument());
    await expect(call).rejects.toThrow();
  });

  it('sendEmailForgotPasswordVerficationLink should throw when mail service fails', async () => {
    emailService.send.mockRejectedValue(new Error());
    const call = () =>
      service.sendEmailForgotPasswordVerficationLink(new UserDocument());
    await expect(call).rejects.toThrow();
  });

  it('sendEmailChangeActiveEmail should throw when mail service fails', async () => {
    emailService.send.mockRejectedValue(new Error());
    const call = () => service.sendEmailChangeActiveEmail(new UserDocument());
    await expect(call).rejects.toThrow();
  });

  it('validationToken should return correct value', async () => {
    repo.findOne.mockResolvedValueOnce({
      id: 'id',
    } as any);
    const result = await service.validationToken(new VerificationTokenDTO());
    expect(result).toEqual({
      token: 'token',
    });
  });

  it('validationToken should throw when user not found', async () => {
    const call = () => service.validationToken(new VerificationTokenDTO());
    await expect(call).rejects.toThrow();
  });

  it('resetPassword should return correct value', async () => {
    queryBuilder.getOne.mockResolvedValue({
      id: 'id',
    } as any);
    const dto = new ResetPasswordDTO();
    dto.password = 'password';
    dto.new_password = 'new_password';
    await service.resetPassword(dto, '');
    repo.save.mockImplementation((entity) => entity as any);
    expect(repo.save).toBeCalledTimes(1);
    await new Promise(process.nextTick);
    expect(commonService.postHttp).toBeCalled();
  });

  it('resetPassword should throw when password and new password same', async () => {
    queryBuilder.getOne.mockResolvedValue({
      id: 'id',
    } as any);
    const dto = new ResetPasswordDTO();
    dto.password = 'password';
    dto.new_password = 'password';
    const call = () => service.resetPassword(dto, '');
    await expect(call).rejects.toThrow();
  });

  it('resetPassword should throw when validation error', async () => {
    const dto = new ResetPasswordDTO();
    dto.password = 'password';
    dto.new_password = 'new_password';
    const call = () => service.resetPassword(dto, '');
    await expect(call).rejects.toThrow();
  });

  it('getAndValidateByIds should return correct value', async () => {
    queryBuilder.getMany.mockResolvedValueOnce([
      {
        id: 'id',
      } as any,
    ]);
    const result = await service.getAndValidateByIds(['id', 'id2']);
    expect(result).toEqual([
      {
        id: 'id',
      },
    ]);
  });

  it('getAndValidateByIds should throw when not found', async () => {
    const call = () => service.getAndValidateByIds(['id']);
    await expect(call).rejects.toThrow();
  });
});
