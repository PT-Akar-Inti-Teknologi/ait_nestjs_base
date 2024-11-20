import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ModulePermissionsDocument } from './entities/module-permissions.entity';
import { BaseService, MessageService, ResponseService } from '@pt-akar-inti-teknologi/nestjs-base';

@Injectable()
export class ModulesService extends BaseService<
  ModulePermissionsDocument,
  ModulePermissionsDocument,
  ModulePermissionsDocument
> {
  constructor(
    @InjectRepository(ModulePermissionsDocument)
    public repository: Repository<ModulePermissionsDocument>,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
  ) {
    super(repository, responseService, messageService, ModulesService.name);
    this.tableAlias = 'user_roles';
    this.relations = ['group'];
  }

  public async findMany() {
    return this.repository.find({ relations: this.relations });
  }
}
