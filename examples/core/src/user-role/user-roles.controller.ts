import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { CreateUserRolesDTO } from './dto/create-user-roles.dto';
import { UpdateUserRolesDTO } from './dto/update-user-roles.dto';
import {
  AuthJwtGuard,
  BaseController,
  MessageService,
  Permission,
  ResponseService,
} from '@pt-akar-inti-teknologi/nestjs-base';
import { ModulesService } from './modules.service';
import { RolesDocument } from './entities/roles.entity';
import { GetUserRolesDTO } from './dto/get-user-roles.dto';

@Controller('api/v1/core/user-roles')
export class UserRolesController extends BaseController<
  CreateUserRolesDTO,
  UpdateUserRolesDTO,
  RolesDocument,
  GetUserRolesDTO
> {
  constructor(
    private readonly userRolesService: UserRolesService,
    private readonly modulesService: ModulesService,
    protected readonly messageService: MessageService,
    protected readonly responseService: ResponseService,
  ) {
    super(
      userRolesService,
      responseService,
      messageService,
      UserRolesController.name,
    );
  }

  @Post()
  @Permission('user_roles.create')
  @AuthJwtGuard()
  async save(@Body() payload: CreateUserRolesDTO) {
    return super.save(payload);
  }

  @Put('/:id')
  @Permission('user_roles.update')
  @AuthJwtGuard()
  async update(@Param('id') id: string, @Body() payload: UpdateUserRolesDTO) {
    return super.update(id, payload);
  }

  @Get()
  @AuthJwtGuard()
  async findAll(@Query() params: GetUserRolesDTO) {
    return super.findAll(params);
  }

  @Get('/access-template')
  @Permission('user_roles.create')
  @AuthJwtGuard()
  async getAccessTemplate() {
    return this.responseService.success(
      await this.modulesService.findMany(),
      this.messageService.get('general.list.success'),
    );
  }
}
