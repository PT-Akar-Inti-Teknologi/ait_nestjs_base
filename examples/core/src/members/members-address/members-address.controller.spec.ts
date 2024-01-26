import { Test, TestingModule } from '@nestjs/testing';
import { MembersAddressController } from './members-address.controller';
import { MembersAddressService } from './members-address.service';
import {
  CreateMembersAddressDTO,
  UpdateMembersAddressDTO,
} from './dto/members-address.dto';
import { MessageService } from '@ait/nestjs-base';
import { ResponseService } from '@ait/nestjs-base';
import { ListPaginationInterface } from '@ait/nestjs-base';
import { DeleteResult } from 'typeorm';
import { MemberAddressDocument } from '../entities/member-address.entity';
import { MainPagingDTO } from '@ait/nestjs-base';

describe('MembersAddressController', () => {
  let controller: MembersAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersAddressController],
      providers: [MessageService, ResponseService],
    })
      .useMocker((token) => {
        if (token === MembersAddressService) {
          return {
            findAll: jest.fn().mockResolvedValue(<
              ListPaginationInterface<MemberAddressDocument>
            >{
              pagination: {},
              content: [new MemberAddressDocument()],
            }),
            getDetailAndValidateById: jest.fn().mockResolvedValue(<
              MemberAddressDocument
            >{
              id: 'id',
            }),
            save: jest.fn().mockResolvedValue(<MemberAddressDocument>{
              id: 'id',
            }),
            update: jest.fn().mockResolvedValue(<MemberAddressDocument>{
              id: 'id',
            }),
            delete: jest.fn().mockResolvedValue(<DeleteResult>{
              affected: 1,
            }),
            saveImage: jest.fn().mockResolvedValue('imageUrl'),
          };
        }
      })
      .compile();

    controller = module.get<MembersAddressController>(MembersAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should return correct output', async () => {
    const param = new MainPagingDTO();
    const result = await controller.findAll(param);
    expect(result.response_output.list.content).toHaveLength(1);
  });

  it('show should return correct output', async () => {
    const result = await controller.show('id');
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('save should return correct output', async () => {
    const result = await controller.save(new CreateMembersAddressDTO());
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('update should return correct output', async () => {
    const result = await controller.update('id', new UpdateMembersAddressDTO());
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('delete should return correct output', async () => {
    const result = await controller.delete('id');
    expect(result.response_output.detail.affected).toEqual(1);
  });
});
