import { BaseService } from '../service/service.base';
import { MessageService } from '../../message/message.service';
import { ResponseService } from '../../response/response.service';
import {
  Body,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { MainPagingDTO } from '../../common/dto/main-paging.dto';
import {
  ResponseSuccessPaginationInterface,
  ResponseSuccessSingleInterface,
} from '../../response/response.interface';
import { IUser } from '../../auth/guard/interface/user.interface';
import { ClassConstructor, plainToClass } from 'class-transformer';

/**
 * Base class for providing CRUD (Create, Read, Update, Delete) operations over HTTP (GET, POST, PUT, DELETE).
 * @template CreateDTO - The DTO used to create an entity
 * @template UpdateDTO - The DTO used to update an entity
 * @template EntityDocument - The entity document type
 */
export abstract class BaseController<
  CreateDTO,
  UpdateDTO,
  EntityDocument,
  PagingDTO extends MainPagingDTO = MainPagingDTO,
> {
  public readonly logger;

  protected constructor(
    protected readonly service: BaseService<
      CreateDTO,
      UpdateDTO,
      EntityDocument,
      PagingDTO
    >,
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
    protected readonly className: string,
    protected readonly pagingClass: ClassConstructor<any> = MainPagingDTO,
  ) {
    this.logger = new Logger(className);
  }

  /**
   * GET endpoint to find all entities. This method can be overridden in child classes.
   * @param mainPagingDTO - The DTO containing pagination data
   * @returns - The HTTP response containing the list of entities and pagination details
   */
  @Get()
  async findAll(
    @Query() mainPagingDTO: PagingDTO,
  ): Promise<ResponseSuccessPaginationInterface> {
    if (!(mainPagingDTO instanceof MainPagingDTO)) {
      mainPagingDTO = plainToClass(this.pagingClass, mainPagingDTO as any);
    }
    const result = await this.service.findAll(mainPagingDTO);
    return this.responseService.successCollection(
      result.content,
      result.pagination,
    );
  }

  /**
   * GET endpoint to retrieve a single entity with detail. This method can be overridden in child classes.
   * @param id - The id of the entity to be retrieved
   * @returns - The HTTP response containing the retrieved entity
   */
  @Get('/:id')
  async show(@Param('id') id: string): Promise<ResponseSuccessSingleInterface> {
    const result: EntityDocument =
      await this.service.getDetailAndValidateById(id);
    return this.responseService.success(
      result,
      this.messageService.get('general.get.success'),
    );
  }

  /**
   * POST endpoint to create a new entity. This method can be overridden in child classes.
   * @param createDTO - The DTO containing the data to create the entity
   * @returns - The HTTP response containing the created entity
   */
  @Post()
  async save(
    @Body() createDTO: CreateDTO,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    user?: IUser,
  ): Promise<ResponseSuccessSingleInterface> {
    const result: EntityDocument = await this.service.save(createDTO);
    return this.responseService.success(
      result,
      this.messageService.get('general.create.success'),
    );
  }

  /**
   * PUT endpoint to update an existing entity. This method can be overridden in child classes.
   * @param id - The id of the entity to be updated
   * @param updateDTO - The DTO containing the data to update the entity
   * @returns - The HTTP response containing the updated entity
   */
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateDTO: UpdateDTO,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    user?: IUser,
  ): Promise<ResponseSuccessSingleInterface> {
    const result: EntityDocument = await this.service.update(updateDTO, id);
    return this.responseService.success(
      result,
      this.messageService.get('general.update.success'),
    );
  }

  /**
   * DELETE endpoint to delete an existing entity. This method can be overridden in child classes.
   * @param id - The id of the entity to be deleted
   * @returns - The HTTP response containing the result of the delete operation
   */
  @Delete('/:id')
  async delete(
    @Param('id') id: string,
  ): Promise<ResponseSuccessSingleInterface> {
    const result: DeleteResult = await this.service.delete(id);

    return this.responseService.success(
      result,
      this.messageService.get('general.delete.success'),
    );
  }
}
