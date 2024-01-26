import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ModulePermissionsDocument } from './entities/module-permissions.entity';
import { BaseService, MessageService, ResponseService } from '@ait/nestjs-base';

@Injectable()
export class ModulesService extends BaseService<
  ModulePermissionsDocument,
  ModulePermissionsDocument,
  ModulePermissionsDocument
> {
  constructor(
    @InjectRepository(ModulePermissionsDocument)
    public repository: Repository<ModulePermissionsDocument>,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {
    super(repository, responseService, messageService, ModulesService.name);
    this.tableAlias = 'user_roles';
    this.relations = ['group'];
  }

  public async findMany() {
    return this.repository.find({ relations: this.relations });
  }
}
