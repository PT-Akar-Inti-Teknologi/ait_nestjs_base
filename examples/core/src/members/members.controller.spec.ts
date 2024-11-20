import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { CreateMemberDTO } from './dto/create-member.dto';
import { MemberDocument } from './entities/member.entity';
import { MessageService } from '@pt-akar-inti-teknologi/nestjs-base';
import { ResponseService } from '@pt-akar-inti-teknologi/nestjs-base';
import { ListPaginationInterface } from '@pt-akar-inti-teknologi/nestjs-base';
import { DeleteResult } from 'typeorm';
import { UpdateMemberDTO } from './dto/update-member.dto';
import { GetMemberDTO } from './dto/member.dto';

describe('MembersController', () => {
  let controller: MembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [MessageService, ResponseService],
    })
      .useMocker((token) => {
        if (token === MembersService) {
          return {
            findAll: jest.fn().mockResolvedValue(<
              ListPaginationInterface<MemberDocument>
            >{
              pagination: {},
              content: [new MemberDocument()],
            }),
            getDetailAndValidateById: jest.fn().mockResolvedValue(<
              MemberDocument
            >{
              id: 'id',
            }),
            save: jest.fn().mockResolvedValue(<MemberDocument>{
              id: 'id',
            }),
            update: jest.fn().mockResolvedValue(<MemberDocument>{
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

    controller = module.get<MembersController>(MembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll should return correct output', async () => {
    const param = new GetMemberDTO();
    const result = await controller.findAll(param);
    expect(result.response_output.list.content).toHaveLength(1);
  });

  it('show should return correct output', async () => {
    const result = await controller.show('id');
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('save should return correct output', async () => {
    const result = await controller.save(new CreateMemberDTO());
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('update should return correct output', async () => {
    const result = await controller.update('id', new UpdateMemberDTO());
    expect(result.response_output.detail.id).toEqual('id');
  });

  it('delete should return correct output', async () => {
    const result = await controller.delete('id');
    expect(result.response_output.detail.affected).toEqual(1);
  });

  it('uploadPhoto should return correct output', async () => {
    const result = await controller.uploadPhoto({} as any);
    expect(result.response_output.detail).toEqual('imageUrl');
  });
});
