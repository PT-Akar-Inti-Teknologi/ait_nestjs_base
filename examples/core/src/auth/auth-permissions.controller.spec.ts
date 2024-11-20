import { Test, TestingModule } from '@nestjs/testing';
import { AuthPermissionController } from './auth-permissions.controller';
import { AuthPermissionsService } from './auth-permissions.service';
import { DeleteResult } from 'typeorm';
import { ResponseService } from '@pt-akar-inti-teknologi/nestjs-base';
import { MessageService } from '@pt-akar-inti-teknologi/nestjs-base';
import { SavePermissionDTO } from 'src/auth/dto/save-permission.dto';
import { DeletePermissionDTO } from 'src/auth/dto/delete-permission.dto';

describe('AuthPermissionController', () => {
  let controller: AuthPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthPermissionController],
      providers: [ResponseService, MessageService],
    })
      .useMocker((token) => {
        if (token === AuthPermissionsService) {
          return {
            save: jest.fn().mockResolvedValue({
              id: 'id',
            }),
            remove: jest.fn().mockResolvedValue(<DeleteResult>{
              affected: 1,
            }),
          };
        }
      })
      .compile();

    controller = module.get<AuthPermissionController>(AuthPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('save should return correct output', async () => {
    const result = await controller.save(new SavePermissionDTO());
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('delete should return correct output', async () => {
    const result = await controller.delete(new DeletePermissionDTO());
    expect(result.response_output.detail.affected).toEqual(1);
  });
});
