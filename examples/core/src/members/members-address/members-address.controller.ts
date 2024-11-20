import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MembersAddressService } from './members-address.service';
import {
  CreateMembersAddressDTO,
  UpdateMembersAddressDTO,
} from './dto/members-address.dto';
import { MemberAddressDocument } from '../entities/member-address.entity';
import {
  AuthJwtGuard,
  BaseController,
  MainPagingDTO,
  MessageService,
  Permission,
  ResponseService,
  ResponseSuccessPaginationInterface,
  ResponseSuccessSingleInterface,
} from '@pt-akar-inti-teknologi/nestjs-base';

@Controller('api/v1/core/members-addresses')
export class MembersAddressController extends BaseController<
  CreateMembersAddressDTO,
  UpdateMembersAddressDTO,
  MemberAddressDocument
> {
  constructor(
    private readonly membersAddressService: MembersAddressService,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
  ) {
    super(
      membersAddressService,
      responseService,
      messageService,
      MembersAddressController.name,
    );
  }

  @Get()
  @Permission('members.read')
  @AuthJwtGuard()
  async findAll(
    @Query() mainPagingDTO: MainPagingDTO,
  ): Promise<ResponseSuccessPaginationInterface> {
    return this.findAll(mainPagingDTO);
  }

  @Get('/:id')
  @Permission('members.read')
  @AuthJwtGuard()
  async show(@Param('id') id: string): Promise<ResponseSuccessSingleInterface> {
    return this.show(id);
  }

  @Post()
  @Permission('members.create')
  @AuthJwtGuard()
  async save(
    @Body() createDTO: CreateMembersAddressDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.save(createDTO);
  }

  @Put('/:id')
  @Permission('members.update')
  @AuthJwtGuard()
  async update(
    @Param('id') id: string,
    @Body() updateDTO: UpdateMembersAddressDTO,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.update(id, updateDTO);
  }

  @Delete('/:id')
  @Permission('members.delete')
  @AuthJwtGuard()
  async delete(
    @Param('id') id: string,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.delete(id);
  }
}
