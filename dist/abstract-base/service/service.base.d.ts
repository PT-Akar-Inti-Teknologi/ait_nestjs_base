import { ResponseService } from '../../response/response.service';
import { DeleteResult, Repository, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import { MessageService } from '../../message/message.service';
import { MainPagingDTO } from '../../common/dto/main-paging.dto';
import { ListPaginationInterface, PaginationInterface } from '../../response/response.interface';
/** Query AND/OR filter */
export type BaseFilterLogicalOperator = 'AND' | 'OR';
/** Comparator enum for filter */
export type BaseFilterComparator = '=' | '<' | '<=' | '>' | '>=' | 'IN' | 'NOT NULL' | 'NULL';
/** Represent a single where query */
export interface BaseFilterInterfaceSingle<PagingDTO> {
    logical_operator?: BaseFilterLogicalOperator;
    field: string;
    comparator?: BaseFilterComparator;
    key: keyof PagingDTO & string;
}
export type BaseFilterInterface<PagingDTO> = BaseFilterInterfaceSingle<PagingDTO> | BaseFilterInterface<PagingDTO>[];
/**
 * Base class for providing generic CRUD (Create, Read, Update, Delete) operations.
 * @template CreateDTO - The DTO used to create an entity
 * @template UpdateDTO - The DTO used to update an entity
 * @template EntityDocument - The entity document type
 */
export declare class BaseService<CreateDTO, UpdateDTO, EntityDocument, PagingDTO extends MainPagingDTO = MainPagingDTO> {
    repository: Repository<EntityDocument>;
    private readonly baseResponseService;
    private readonly baseMessageService;
    private readonly className;
    readonly logger: any;
    protected relations: string[];
    protected tableAlias: string;
    protected searchByFields: string[];
    protected defaultSort: string;
    protected defaultOrder: 'ASC' | 'DESC';
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
    protected filterByFields: BaseFilterInterface<PagingDTO>[];
    protected constructor(repository: Repository<EntityDocument>, baseResponseService: ResponseService, baseMessageService: MessageService, className: string);
    /**
     * Save an entity in the database. This method can be overridden in child classes.
     * @param createDTO - The DTO containing the data to be saved
     * @returns - The saved entity
     */
    save(createDTO: CreateDTO): Promise<EntityDocument>;
    /**
     * Update an entity in the database. This method can be overridden in child classes.
     * @param updateDTO - The DTO containing the data to be updated
     * @param id - The id of the entity to be updated
     * @returns - The updated entity
     */
    update(updateDTO: UpdateDTO, id: string): Promise<EntityDocument>;
    /**
     * Delete an entity from the database. This method can be overridden in child classes.
     * @param id - The id of the entity to be deleted
     * @returns - Result of the delete operation
     */
    delete(id: string): Promise<DeleteResult>;
    /**
     * Find all entities in the database. This method can be overridden in child classes.
     * @param mainPagingDTO - The DTO containing pagination data
     * @returns - The list of entities and pagination details
     */
    findAll(mainPagingDTO: PagingDTO): Promise<ListPaginationInterface<EntityDocument>>;
    /**
     * Save an entity in the database
     * @param createDTO - The DTO containing the data to be saved
     * @returns - The saved entity
     */
    baseSave(createDTO: CreateDTO): Promise<EntityDocument>;
    /**
     * Update an entity in the database
     * @param updateDTO - The DTO containing the data to be updated
     * @param id - The id of the entity to be updated
     * @returns - The updated entity
     */
    baseUpdate(updateDTO: UpdateDTO, id: string): Promise<EntityDocument>;
    /**
     * Delete an entity from the database
     * @param id - The id of the entity to be deleted
     * @returns - Result of the delete operation
     */
    baseDelete(id: string): Promise<DeleteResult>;
    /**
     * Find all entities in the database
     * @param mainPagingDTO - The DTO containing pagination data
     * @returns - The list of entities and pagination details
     */
    baseFindAll(mainPagingDTO: PagingDTO): Promise<ListPaginationInterface<EntityDocument>>;
    /**
     * use `filterQuery` as parameter to add a single where clause to `query`
     * @param mainPagingDTO - query from request
     * @param filterQuery - item that's need to be filtered
     * @param queryBuilder - query builder
     */
    baseFilterQuery(mainPagingDTO: PagingDTO, filterQuery: BaseFilterInterfaceSingle<PagingDTO>, queryBuilder: SelectQueryBuilder<EntityDocument> | WhereExpressionBuilder): void;
    /**
     * use `filterQuery` as parameter to add a multiple where clause to `query`
     * will recursively call baseFilterAllQuery and baseFilterQuery until all parameter parsed
     * @param mainPagingDTO - query from request
     * @param filterQueries - items that's need to be filtered
     * @param queryBuilder - query builder
     */
    baseFilterAllQuery(mainPagingDTO: PagingDTO, filterQueries: BaseFilterInterface<PagingDTO>[], queryBuilder: SelectQueryBuilder<EntityDocument> | WhereExpressionBuilder): void;
    /**
     * Query builder to find all entities in the database
     * @param mainPagingDTO - The DTO containing pagination data
     * @returns - The list of entities and pagination details
     */
    baseFindAllQuery(mainPagingDTO: PagingDTO): Promise<SelectQueryBuilder<EntityDocument>>;
    /**
     * This is an asynchronous function that retrieves a paginated detail list of entities based on search
     * criteria and sorting options.
     * @param {PagingDTO} mainPagingDTO - The mainPagingDTO parameter is an object that contains
     * information about pagination and search. It has the following properties:
     * @returns This function returns a Promise that resolves to an object with two properties: "content"
     * and "pagination". The "content" property is an array of EntityDocument objects, while the
     * "pagination" property is an object with three properties: "page", "total", and "size".
     */
    baseFindDetailAll(mainPagingDTO: PagingDTO, relations?: string[]): Promise<ListPaginationInterface<EntityDocument>>;
    baseGetManyAndCount(mainPagingDTO: PagingDTO, query: SelectQueryBuilder<EntityDocument>): Promise<{
        content: EntityDocument[];
        pagination: PaginationInterface;
    }>;
    /**
     * use `this.searchByFields` to add search query if `mainPagingDTO.search` exists
     * @param queryBuilder - query builder
     * @param {PagingDTO} mainPagingDTO - The mainPagingDTO parameter is an object that contains
     */
    baseSearchAllQuery(queryBuilder: SelectQueryBuilder<EntityDocument>, mainPagingDTO: PagingDTO): void;
    /**
     * use `relations` or `this.relations` data to add join query to existing query
     * @param queryBuilder - query builder
     * @param {string[]} relations - optional parameter to override `this.relations`
     */
    baseAddJoinQuery(queryBuilder: SelectQueryBuilder<EntityDocument>, relations?: string[]): void;
    /**
     * This is an asynchronous function that return query for baseFindDetailAll
     * @param {PagingDTO} mainPagingDTO - The mainPagingDTO parameter is an object that contains
     * @param {string[]} relations - optional parameter to override `this.relations`
     * information about pagination and search. It has the following properties:
     * @returns This function returns a Promise that resolves to an object with two properties: "content"
     * and "pagination". The "content" property is an array of EntityDocument objects, while the
     * "pagination" property is an object with three properties: "page", "total", and "size".
     */
    baseFindDetailAllQuery(mainPagingDTO: PagingDTO, relations?: string[]): SelectQueryBuilder<EntityDocument>;
    /**
     * Fetch an entity from the database and validate its existence
     * @param id - The id of the entity to be fetched
     * @returns - The fetched entity
     */
    getAndValidateById(id: string): Promise<EntityDocument>;
    /**
     * This function retrieves and validates an entity document based on a specified field and value.
     * @param {string} field - A string representing the name of the field in the database table that the
     * function will use to search for a record.
     * @param {string} value - The value to be used in the query to retrieve the EntityDocument. It is
     * used in the WHERE clause of the query to filter the results based on the specified field.
     * @returns This function returns a Promise that resolves to an EntityDocument object.
     */
    getAndValidateByField(field: string, value: string): Promise<EntityDocument>;
    /**
     * Generate query to fetch detailed entity from the database
     * @param id - The id of the entity to be fetched
     * @returns - Query builder
     */
    getDetailByIdQuery(id: string): SelectQueryBuilder<EntityDocument>;
    throwGenericNotFound(): void;
    /**
     * Fetch detailed entity from the database and validate its existence
     * @param id - The id of the entity to be fetched
     * @returns - The fetched detailed entity
     */
    getDetailAndValidateById(id: string): Promise<EntityDocument>;
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
    isUnique(field: string, value: string, exludeId?: any): Promise<void>;
}
//# sourceMappingURL=service.base.d.ts.map