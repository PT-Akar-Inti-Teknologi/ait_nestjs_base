import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { MessageService, ResponseService } from '@ait/nestjs-base';
import { LoginDTO } from './dto/login.dto';

describe('LoginController', () => {
  let controller: LoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [MessageService, ResponseService],
    })
      .useMocker((token) => {
        if (token === LoginService) {
          return {
            loginByEmail: jest.fn().mockResolvedValue({
              token: 'token',
              refreshtoken: 'refreshtoken',
            }),
            refreshToken: jest.fn().mockResolvedValue({
              token: 'token',
              refreshtoken: 'refreshtoken',
            }),
          };
        }
      })
      .compile();

    controller = module.get<LoginController>(LoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should return correct output', async () => {
    const param = new LoginDTO();
    const result = await controller.loginByEmail(param);
    expect(result.response_output.detail).toMatchObject({
      token: 'token',
      refreshtoken: 'refreshtoken',
    });
  });

  it('refreshTOken should return correct output', async () => {
    const result = await controller.refreshToken({});
    expect(result.response_output.detail).toMatchObject({
      token: {
        token: 'token',
        refreshtoken: 'refreshtoken',
      },
    });
  });
});
