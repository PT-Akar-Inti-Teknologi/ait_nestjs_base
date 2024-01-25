import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserDocument } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import { UpdateUserDTO } from './dto/update-user.dto';
import { GetUserDTO } from './dto/get-user.dto';
import { ResponseService } from '@ait/nestjs-base';
import { DeleteUserDTO } from './dto/delete-user.dto';
import { VerificationTokenDTO } from './dto/verification-token.dto';
import { IUser } from '@ait/nestjs-base';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { MessageService } from '@ait/nestjs-base';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [ResponseService, MessageService],
    })
      .useMocker((token) => {
        if (token === UsersService) {
          const user = <UserDocument>{
            id: 'id',
          };
          return {
            findAll: jest.fn().mockResolvedValue({
              count: 1,
              list: [new UserDocument()],
            }),
            getAndValidate: jest.fn().mockResolvedValue(user),
            create: jest.fn().mockResolvedValue(user),
            update: jest.fn().mockResolvedValue(user),
            remove: jest.fn().mockResolvedValue(<DeleteResult>{
              affected: 1,
            }),
            validationToken: jest.fn().mockResolvedValue({ token: 'token' }),
            resetPassword: jest.fn().mockResolvedValue(user),
            myProfile: jest.fn().mockResolvedValue(user),
            sendVerificationLink: jest.fn().mockResolvedValue(user),
            forgotPassword: jest.fn().mockResolvedValue(user),
          };
        }
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('verificationToken should return correct output', async () => {
    const result = await controller.verificationToken(
      new VerificationTokenDTO(),
    );
    expect(result.response_output.detail.token).toEqual('token');
  });

  it('resetPassword should return correct output', async () => {
    const result = await controller.resetPassword(
      new ResetPasswordDTO(),
      {} as IUser,
    );
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('create should return correct output', async () => {
    const result = await controller.create(new CreateUserDTO());
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('findAll should return correct output', async () => {
    const param = new GetUserDTO();
    const result = await controller.findAll(param);
    expect(result.response_output.list.content).toHaveLength(1);
  });

  it('myProfile should return correct output', async () => {
    const result = await controller.myProfile({} as IUser);
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('findOne should return correct output', async () => {
    const result = await controller.findOne('id');
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('update should return correct output', async () => {
    const result = await controller.update('id', new UpdateUserDTO());
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('remove should return correct output', async () => {
    const result = await controller.remove('id', new DeleteUserDTO());
    expect(result.response_output.detail.affected).toEqual(1);
  });

  it('resendVerificationLink should return correct output', async () => {
    const result = await controller.resendVerificationLink('id');
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('forgotPassword should return correct output', async () => {
    const result = await controller.forgotPassword(new ForgotPasswordDTO());
    expect(result.response_output.detail.id).toEqual('id');
  });
});
