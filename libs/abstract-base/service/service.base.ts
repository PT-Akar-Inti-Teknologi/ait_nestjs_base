import { ResponseService } from '../../response/response.service';
import {
  Brackets,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
  WhereExpressionBuilder,
} from 'typeorm';
import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import { MessageService } from '../../message/message.service';
import { MainPagingDTO } from '../../common/dto/main-paging.dto';
import {
  ListPaginationInterface,
  PaginationInterface,
} from '../../response/response.interface';

/** Query AND/OR filter */
export type BaseFilterLogicalOperator = 'AND' | 'OR';

/** Comparator enum for filter */
export type BaseFilterComparator =
  | '='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'IN'
  | 'NOT NULL'
  | 'NULL';

/** Represent a single where query */
export interface BaseFilterInterfaceSingle<PagingDTO> {
  logical_operator?: BaseFilterLogicalOperator;
  field: string;
  comparator?: BaseFilterComparator;
  key: keyof PagingDTO & string;
}

export type BaseFilterInterface<PagingDTO> =
  | BaseFilterInterfaceSingle<PagingDTO>
  | BaseFilterInterface<PagingDTO>[];

/**
 * Base class for providing generic CRUD (Create, Read, Update, Delete) operations.
 * @template CreateDTO - The DTO used to create an entity
 * @template UpdateDTO - The DTO used to update an entity
 * @template EntityDocument - The entity document type
 */
export class BaseService<
  CreateDTO,
  UpdateDTO,
  EntityDocument,
  PagingDTO extends MainPagingDTO = MainPagingDTO,
> {
  public readonly logger;

  protected relations: string[] = [];
  protected tableAlias: string;
  protected searchByFields: string[] = ['name'];
  protected defaultSort = 'created_at';
  protected defaultOrder: 'ASC' | 'DESC' = 'DESC';

  /**
   * filter from key in MainPagingDTO to table fields and its relationship.
   * for simple filter, can use string as value, if need other relation can use array of field/relationship
   * example:
   * ```json
   * [
   *   ['user_id', `${this.tableAlias}.user_id`],
   *   ['date_start', `${this.tableAlias}.date_start`, '<='],
   * ]
   * ```
   */
  protected filterByFields: BaseFilterInterface<PagingDTO>[] = [];

  protected constructor(
    public repository: Repository<EntityDocument>,
    private readonly baseResponseService: ResponseService,
    private readonly baseMessageService: MessageService,
    private readonly className: string,
  ) {
    this.logger = new Logger(`${className}.${BaseService.name}`);
  }

  /**
   * Save an entity in the database. This method can be overridden in child classes.
   * @param createDTO - The DTO containing the data to be saved
   * @returns - The saved entity
   */
  public async save(createDTO: CreateDTO): Promise<EntityDocument> {
    return this.baseSave(createDTO);
  }

  /**
   * Update an entity in the database. This method can be overridden in child classes.
   * @param updateDTO - The DTO containing the data to be updated
   * @param id - The id of the entity to be updated
   * @returns - The updated entity
   */
  public async update(
    updateDTO: UpdateDTO,
    id: string,
  ): Promise<EntityDocument> {
    return this.baseUpdate(updateDTO, id);
  }

  /**
   * Delete an entity from the database. This method can be overridden in child classes.
   * @param id - The id of the entity to be deleted
   * @returns - Result of the delete operation
   */
  public async delete(id: string): Promise<DeleteResult> {
    return this.baseDelete(id);
  }

  /**
   * Find all entities in the database. This method can be overridden in child classes.
   * @param mainPagingDTO - The DTO containing pagination data
   * @returns - The list of entities and pagination details
   */
  async findAll(
    mainPagingDTO: PagingDTO,
  ): Promise<ListPaginationInterface<EntityDocument>> {
    return this.baseFindAll(mainPagingDTO);
  }

  /**
   * Save an entity in the database
   * @param createDTO - The DTO containing the data to be saved
   * @returns - The saved entity
   */
  public async baseSave(createDTO: CreateDTO): Promise<EntityDocument> {
    try {
      const entitySave: Partial<EntityDocument> = Object.assign({}, createDTO);
      return this.repository.save(entitySave as EntityDocument);
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * Update an entity in the database
   * @param updateDTO - The DTO containing the data to be updated
   * @param id - The id of the entity to be updated
   * @returns - The updated entity
   */
  public async baseUpdate(
    updateDTO: UpdateDTO,
    id: string,
  ): Promise<EntityDocument> {
    try {
      const record: EntityDocument = await this.getAndValidateById(id);

      Object.assign(record, {
        ...updateDTO,
      });

      return this.repository.save(record);
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * Delete an entity from the database
   * @param id - The id of the entity to be deleted
   * @returns - Result of the delete operation
   */
  public async baseDelete(id: string): Promise<DeleteResult> {
    try {
      const entity = await this.getAndValidateById(id);
      await this.repository.softRemove(entity);
      return {
        generatedMaps: [],
        raw: [],
        affected: 1,
      } as any;
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * Find all entities in the database
   * @param mainPagingDTO - The DTO containing pagination data
   * @returns - The list of entities and pagination details
   */
  async baseFindAll(
    mainPagingDTO: PagingDTO,
  ): Promise<ListPaginationInterface<EntityDocument>> {
    const query = await this.baseFindAllQuery(mainPagingDTO);
    try {
      const result = await query.getManyAndCount();

      const pagination: PaginationInterface = {
        page: mainPagingDTO.page,
        total: result[1],
        size: mainPagingDTO.size,
      };
      return {
        content: result[0],
        pagination,
      };
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * use `filterQuery` as parameter to add a single where clause to `query`
   * @param mainPagingDTO - query from request
   * @param filterQuery - item that's need to be filtered
   * @param queryBuilder - query builder
   */
  baseFilterQuery(
    mainPagingDTO: PagingDTO,
    filterQuery: BaseFilterInterfaceSingle<PagingDTO>,
    queryBuilder: SelectQueryBuilder<EntityDocument> | WhereExpressionBuilder,
  ) {
    const {
      logical_operator = 'and',
      field,
      comparator = '=',
      key,
    } = filterQuery;
    if (mainPagingDTO[key] === undefined) return;
    // build query string
    let operation = `${field} ${comparator} :${key}`;
    if (comparator.toUpperCase() == 'IN') {
      operation = `${field} ${comparator} (:...${key})`;
    } else if (comparator.toUpperCase() == 'NULL') {
      queryBuilder.orWhere(`${field} IS NULL`);
      return;
    } else if (comparator.toUpperCase() == 'NOT NULL') {
      queryBuilder.orWhere(
        `${field} IS ${mainPagingDTO[key] ? 'NOT NULL' : 'NULL'}`,
      );
      return;
    }

    if (logical_operator == 'OR') {
      queryBuilder.orWhere(operation, {
        [key]: mainPagingDTO[key],
      });
      return;
    }
    queryBuilder.andWhere(operation, {
      [key]: mainPagingDTO[key],
    });
  }

  /**
   * use `filterQuery` as parameter to add a multiple where clause to `query`
   * will recursively call baseFilterAllQuery and baseFilterQuery until all parameter parsed
   * @param mainPagingDTO - query from request
   * @param filterQueries - items that's need to be filtered
   * @param queryBuilder - query builder
   */
  baseFilterAllQuery(
    mainPagingDTO: PagingDTO,
    filterQueries: BaseFilterInterface<PagingDTO>[],
    queryBuilder: SelectQueryBuilder<EntityDocument> | WhereExpressionBuilder,
  ) {
    for (const filterQuery of filterQueries) {
      if (Array.isArray(filterQuery)) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            this.baseFilterAllQuery(mainPagingDTO, filterQuery, qb);
          }),
        );
      } else {
        this.baseFilterQuery(mainPagingDTO, filterQuery, queryBuilder);
      }
    }
  }

  /**
   * Query builder to find all entities in the database
   * @param mainPagingDTO - The DTO containing pagination data
   * @returns - The list of entities and pagination details
   */
  async baseFindAllQuery(
    mainPagingDTO: PagingDTO,
  ): Promise<SelectQueryBuilder<EntityDocument>> {
    try {
      const query = this.repository.createQueryBuilder(this.tableAlias);

      if (mainPagingDTO.search) {
        query.where(
          new Brackets((qb) => {
            for (const fieldSearch of this.searchByFields) {
              qb.orWhere(`${fieldSearch} ilike :search`, {
                search: `%${mainPagingDTO.search}%`,
              });
            }
          }),
        );
      }
      this.baseFilterAllQuery(mainPagingDTO, this.filterByFields, query);
      if (mainPagingDTO.order && mainPagingDTO.sort) {
        let prefix = '';
        if (!mainPagingDTO.sort.includes('.')) {
          prefix = `${this.tableAlias}.`;
        }
        query.orderBy(`${prefix}${mainPagingDTO.sort}`, mainPagingDTO.order);
      } else {
        query.orderBy(`${this.tableAlias}.created_at`, 'DESC');
      }
      query.take(mainPagingDTO.size);
      query.skip(mainPagingDTO.page * mainPagingDTO.size);

      return query;
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * This is an asynchronous function that retrieves a paginated detail list of entities based on search
   * criteria and sorting options.
   * @param {PagingDTO} mainPagingDTO - The mainPagingDTO parameter is an object that contains
   * information about pagination and search. It has the following properties:
   * @returns This function returns a Promise that resolves to an object with two properties: "content"
   * and "pagination". The "content" property is an array of EntityDocument objects, while the
   * "pagination" property is an object with three properties: "page", "total", and "size".
   */
  async baseFindDetailAll(
    mainPagingDTO: PagingDTO,
    relations?: string[],
  ): Promise<ListPaginationInterface<EntityDocument>> {
    const query = await this.baseFindDetailAllQuery(mainPagingDTO, relations);
    return this.baseGetManyAndCount(mainPagingDTO, query);
  }

  async baseGetManyAndCount(
    mainPagingDTO: PagingDTO,
    query: SelectQueryBuilder<EntityDocument>,
  ) {
    try {
      const result = await query.getManyAndCount();

      const pagination: PaginationInterface = {
        page: mainPagingDTO.page,
        total: result[1],
        size: mainPagingDTO.size,
      };
      return {
        content: result[0],
        pagination,
      };
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * use `this.searchByFields` to add search query if `mainPagingDTO.search` exists
   * @param queryBuilder - query builder
   * @param {PagingDTO} mainPagingDTO - The mainPagingDTO parameter is an object that contains
   */
  baseSearchAllQuery(
    queryBuilder: SelectQueryBuilder<EntityDocument>,
    mainPagingDTO: PagingDTO,
  ) {
    if (mainPagingDTO.search) {
      queryBuilder.where(
        new Brackets((qb) => {
          qb.where(`${this.searchByFields[0]} ilike :search`, {
            search: `%${mainPagingDTO.search}%`,
          });
          if (this.searchByFields && this.searchByFields.length > 1) {
            for (let i = 1; i < this.searchByFields.length; i++) {
              const field = this.searchByFields[i];
              qb.orWhere(`${field} ilike :search`, {
                search: `%${mainPagingDTO.search}%`,
              });
            }
          }
        }),
      );
    }
  }

  /**
   * use `relations` or `this.relations` data to add join query to existing query
   * @param queryBuilder - query builder
   * @param {string[]} relations - optional parameter to override `this.relations`
   */
  baseAddJoinQuery(
    queryBuilder: SelectQueryBuilder<EntityDocument>,
    relations?: string[],
  ) {
    if (!relations || !relations.length) {
      relations = this.relations;
    }

    if (relations && relations.length > 0) {
      relations.forEach((relation) => {
        const splitRelation = relation.split('.').reverse();
        let tabel = this.tableAlias;
        let joinTable = splitRelation[0];
        let alias = splitRelation[0];
        if (splitRelation.length > 1) {
          tabel = splitRelation[1];
          joinTable = splitRelation[0];
          alias = splitRelation[0];
        }
        queryBuilder.leftJoinAndSelect(`${tabel}.${joinTable}`, alias);
      });
    }
  }

  /**
   * This is an asynchronous function that return query for baseFindDetailAll
   * @param {PagingDTO} mainPagingDTO - The mainPagingDTO parameter is an object that contains
   * @param {string[]} relations - optional parameter to override `this.relations`
   * information about pagination and search. It has the following properties:
   * @returns This function returns a Promise that resolves to an object with two properties: "content"
   * and "pagination". The "content" property is an array of EntityDocument objects, while the
   * "pagination" property is an object with three properties: "page", "total", and "size".
   */
  baseFindDetailAllQuery(
    mainPagingDTO: PagingDTO,
    relations?: string[],
  ): SelectQueryBuilder<EntityDocument> {
    try {
      const query = this.repository.createQueryBuilder(this.tableAlias);
      this.baseAddJoinQuery(query, relations);

      this.baseSearchAllQuery(query, mainPagingDTO);
      this.baseFilterAllQuery(mainPagingDTO, this.filterByFields, query);
      if (mainPagingDTO.order && mainPagingDTO.sort) {
        let prefix = '';
        if (!mainPagingDTO.sort.includes('.')) {
          prefix = `${this.tableAlias}.`;
        }
        query.orderBy(`${prefix}${mainPagingDTO.sort}`, mainPagingDTO.order);
      } else {
        query.orderBy(
          `${this.tableAlias}.${this.defaultSort}`,
          this.defaultOrder,
        );
      }
      query.take(mainPagingDTO.size);
      query.skip(mainPagingDTO.page * mainPagingDTO.size);

      return query;
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * Fetch an entity from the database and validate its existence
   * @param id - The id of the entity to be fetched
   * @returns - The fetched entity
   */
  async getAndValidateById(id: string): Promise<EntityDocument> {
    try {
      const recordEntityDocument = await this.repository
        .createQueryBuilder(this.tableAlias)
        .where(`${this.tableAlias}.id = :id`, { id })
        .getOne();
      if (!recordEntityDocument) {
        throw new BadRequestException(
          this.baseResponseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.baseMessageService.getErrorMessage(
                `${this.tableAlias}_id`,
                'general.general.id_not_found',
              ),
            ],
            'Bad Request',
          ),
        );
      }
      return recordEntityDocument;
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * This function retrieves and validates an entity document based on a specified field and value.
   * @param {string} field - A string representing the name of the field in the database table that the
   * function will use to search for a record.
   * @param {string} value - The value to be used in the query to retrieve the EntityDocument. It is
   * used in the WHERE clause of the query to filter the results based on the specified field.
   * @returns This function returns a Promise that resolves to an EntityDocument object.
   */
  async getAndValidateByField(
    field: string,
    value: string,
  ): Promise<EntityDocument> {
    try {
      const recordEntityDocument = await this.repository
        .createQueryBuilder(this.tableAlias)
        .where(`${this.tableAlias}.${field} = :value`, { value })
        .getOne();
      if (!recordEntityDocument) {
        throw new BadRequestException(
          this.baseResponseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.baseMessageService.getErrorMessage(
                field,
                'general.general.data_not_found',
              ),
            ],
            'Bad Request',
          ),
        );
      }
      return recordEntityDocument;
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * Generate query to fetch detailed entity from the database
   * @param id - The id of the entity to be fetched
   * @returns - Query builder
   */
  getDetailByIdQuery(id: string): SelectQueryBuilder<EntityDocument> {
    const queryBuilder = this.repository.createQueryBuilder(this.tableAlias);

    if (this.relations && this.relations.length > 0) {
      this.relations.forEach((relation) => {
        const splitRelation = relation.split('.').reverse();
        let tabel = this.tableAlias;
        let joinTable = splitRelation[0];
        let alias = splitRelation[0];
        if (splitRelation.length > 1) {
          tabel = splitRelation[1];
          joinTable = splitRelation[0];
          alias = splitRelation[0];
        }
        queryBuilder.leftJoinAndSelect(`${tabel}.${joinTable}`, alias);
      });
    }
    queryBuilder.where(`${this.tableAlias}.id = :id`, { id });
    return queryBuilder;
  }

  throwGenericNotFound() {
    throw new BadRequestException(
      this.baseResponseService.error(
        HttpStatus.BAD_REQUEST,
        [
          this.baseMessageService.getErrorMessage(
            'id',
            'general.general.id_not_found',
          ),
        ],
        'Bad Request',
      ),
    );
  }

  /**
   * Fetch detailed entity from the database and validate its existence
   * @param id - The id of the entity to be fetched
   * @returns - The fetched detailed entity
   */
  async getDetailAndValidateById(id: string): Promise<EntityDocument> {
    try {
      const queryBuilder = this.getDetailByIdQuery(id);

      const recordEntityDocument = await queryBuilder.getOne();

      if (!recordEntityDocument) {
        this.throwGenericNotFound();
      }
      return recordEntityDocument;
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * This is an async function that checks if a given value for a specific field already exists in the
   * database, and throws a BadRequestException if it does.
   * @param {string} field - The name of the field in the database table that needs to be checked for
   * uniqueness.
   * @param {string} value - The value parameter is a string that represents the value to be checked
   * for uniqueness in the specified field.
   * @param [exludeId=null] - The `exludeId` parameter is an optional parameter that defaults to
   * `null`. It is used to exclude a record with a specific ID from the query when checking for
   * uniqueness of a field value. This is useful when updating a record and checking if the new value
   * conflicts with an existing value in the
   */
  async isUnique(field: string, value: string, exludeId = null): Promise<void> {
    try {
      const query = this.repository
        .createQueryBuilder(this.tableAlias)
        .where(`${this.tableAlias}.${field} = :value`, { value });
      if (exludeId) {
        query.andWhere(`${this.tableAlias}.id != :exclude_id`, {
          exclude_id: exludeId,
        });
      }
      const recordEntityDocument = await query.getOne();
      if (recordEntityDocument) {
        throw new BadRequestException(
          this.baseResponseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.baseMessageService.getErrorMessage(
                field,
                `general.general.${field}_exist`,
              ),
            ],
            'Bad Request',
          ),
        );
      }
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.baseResponseService.throwError(error);
    }
  }
}
