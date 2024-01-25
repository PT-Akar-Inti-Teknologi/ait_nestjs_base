import { Test, TestingModule } from '@nestjs/testing';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';
import { ResponseService } from '@ait/nestjs-base';
import { MessageService } from '@ait/nestjs-base';
import { RolesDocument } from './entities/roles.entity';
import { ModulesService } from './modules.service';
import { ModulePermissionsDocument } from './entities/module-permissions.entity';
import { CreateUserRolesDTO } from './dto/create-user-roles.dto';
import { UpdateUserRolesDTO } from './dto/update-user-roles.dto';
import { GetUserRolesDTO } from './dto/get-user-roles.dto';

describe('UserRolesController', () => {
  let controller: UserRolesController;
  let service: jest.Mocked<UserRolesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRolesController],
      providers: [ResponseService, MessageService],
    })
      .useMocker((token) => {
        if (token === UserRolesService) {
          return {
            save: jest.fn().mockResolvedValue({
              id: 'id',
            }),
            update: jest.fn().mockResolvedValue({
              id: 'id',
            }),
            findAll: jest.fn().mockResolvedValue({
              pagination: {},
              content: [new RolesDocument()],
            }),
            getAndValidateById: jest.fn().mockResolvedValue({
              id: 'id',
            }),
          };
        }
        if (token === ModulesService) {
          return {
            findMany: jest
              .fn()
              .mockResolvedValue([new ModulePermissionsDocument()]),
          };
        }
      })
      .compile();

    controller = module.get<UserRolesController>(UserRolesController);
    service = module.get<UserRolesService>(UserRolesService) as any;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('save should return correct output', async () => {
    const result = await controller.save(new CreateUserRolesDTO());
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('save should throw when fail save', async () => {
    service.save.mockRejectedValue(new Error());
    const call = () => controller.save(new CreateUserRolesDTO());
    expect(call).rejects.toThrow();
  });

  it('update should return correct output', async () => {
    const result = await controller.update('', new UpdateUserRolesDTO());
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('update should throw when not found', async () => {
    service.getAndValidateById.mockResolvedValue(null);
    const call = () => controller.update('', new UpdateUserRolesDTO());
    expect(call).rejects.toThrow();
  });

  it('findAll should return correct output', async () => {
    const param = new GetUserRolesDTO();
    const result = await controller.findAll(param);
    expect(result.response_output.list.content).toHaveLength(1);
  });

  it('findAll should throw when service throw', async () => {
    service.findAll.mockRejectedValue(new Error());
    const param = new GetUserRolesDTO();
    const call = () => controller.findAll(param);
    expect(call).rejects.toThrow();
  });

  it('getAccessTemplate should return correct output', async () => {
    const result = await controller.getAccessTemplate();
    expect(result.response_output.detail).toHaveLength(1);
  });
});
