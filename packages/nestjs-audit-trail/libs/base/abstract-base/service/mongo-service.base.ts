import { BadRequestException, HttpStatus, Logger } from '@nestjs/common';
import {
  MainPagingDTO,
  ResponseService,
  MessageService,
  ListPaginationInterface,
  PaginationInterface,
} from '@ait/nestjs-base';
import mongoose, { FilterQuery, Model } from 'mongoose';

/** Query AND/OR filter */
export type BaseFilterLogicalOperator = 'AND' | 'OR';

/** Comparator enum for filter */
export type BaseFilterComparator =
  | '='
  | '!='
  | '<'
  | '<='
  | '>'
  | '>='
  | 'IN'
  | 'NOT IN'
  | 'NULL'
  | 'NOT NULL';

/** Operator map for filter
 *
 * nb: add prefix # because cannot implement in string IN , NULL, AND, OR
 */
const operatorMap = {
  '#=': '$eq',
  '#!=': '$ne',
  '#<': '$lt',
  '#<=': '$lte',
  '#>': '$gt',
  '#>=': '$gte',
  '#IN': '$in',
  '#NOT IN': '$nin',
  '#NULL': null,
  '#NOT NULL': { $ne: null },
  '#AND': '$and',
  '#OR': '$or',
};

/**
 * The function returns the corresponding operator based on the given comparator.
 * @param {string} comparator - The `comparator` parameter is a string that represents a comparison operator.
 * @returns string or object.
 */
export function getOperator(comparator: string) {
  return operatorMap['#' + comparator];
}

/**
 * The function converts a filter into an operator for a query in TypeScript.
 * @param {string} field - A string representing the field or property on which the filter will be applied.
 * @param {BaseFilterComparator} comparator - The `comparator` parameter is a value that represents the comparison operator to be used in the filter query. It is of type `BaseFilterComparator`.
 * @param {any} value - The `value` parameter in the `convertFilterToOperator` function is the value that you want to compare against in the filter query.
 *
 * @returns a FilterQuery<any> object.
 */
export function convertFilterToOperator(
  field: string,
  comparator: BaseFilterComparator,
  value: any,
): FilterQuery<any> {
  if (!value) {
    return;
  }
  const query: FilterQuery<any> = {};

  if (operatorMap['#' + comparator] !== null) {
    query[field] = { [operatorMap['#' + comparator]]: value };
  } else {
    query[field] = value;
  }

  return query;
}

/** Represent a single where query */
export interface BaseFilterInterfaceSingle<PagingDTO> {
  // logical_operator?: BaseFilterLogicalOperator;
  field: string;
  comparator?: BaseFilterComparator;
  key: keyof PagingDTO & string;
}

export type BaseFilterInterface<PagingDTO> =
  | BaseFilterInterfaceSingle<PagingDTO>
  | BaseFilterInterface<PagingDTO>[];

export interface BaseFilterGroup<PagingDTO> {
  logical_operator: BaseFilterLogicalOperator;
  conditions: (BaseFilterInterface<PagingDTO> | BaseFilterGroup<PagingDTO>)[];
}

/**
 * Base class for providing generic CRUD (Create, Read, Update, Delete) operations.
 * @template CreateDTO - The DTO used to create an entity
 * @template UpdateDTO - The DTO used to update an entity
 * @template T - The entity document type
 */
export class MongoBaseService<
  CreateDTO,
  UpdateDTO,
  T,
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
  // protected filterByFields: BaseFilterInterface<PagingDTO>[] = [];
  protected filterByFields: BaseFilterGroup<PagingDTO> = {
    logical_operator: 'AND',
    conditions: [],
  };

  protected constructor(
    // public repository: Repository<T>,
    private repository: Model<T>,
    private readonly baseResponseService: ResponseService,
    private readonly baseMessageService: MessageService,
    private readonly className: string,
  ) {
    this.logger = new Logger(`${className}.${MongoBaseService.name}`);
  }

  /**
   * Save an entity in the database
   * @param createDTO - The DTO containing the data to be saved
   * @returns - The saved entity
   */
  public async save(createDTO: CreateDTO): Promise<T> {
    try {
      const entitySave: Partial<T> = Object.assign({}, createDTO);
      return this.repository.create(entitySave as T);
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
  public async update(updateDTO: UpdateDTO, id: string): Promise<T> {
    try {
      const record: T = await this.getAndValidateById(id);

      Object.assign(record, {
        ...updateDTO,
      });

      return this.repository.findByIdAndUpdate(id, record, {
        new: true,
        runValidators: true,
      });
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
  public async delete(id: string): Promise<T> {
    try {
      await this.getAndValidateById(id);
      return this.repository.findByIdAndUpdate(
        id,
        { $set: { deleted_at: Date.now() } },
        { new: true, runValidators: true },
      );
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * The function `baseFilterAllQuery` recursively builds a filter query based on a given set of conditions and logical operators.
   * @param {PagingDTO} mainPagingDTO - The mainPagingDTO parameter is an object of type PagingDTO. It is used as a reference for filtering the data.
   * @param filterQuery - The `filterQuery` parameter is an object of type  `BaseFilterGroup<PagingDTO>`. It represents a group of filter conditions that need to be applied to a query. The `BaseFilterGroup` type has the following structure:
   * @returns the "where" object, which contains the filter conditions based on the provided "mainPagingDTO" and "filterQuery".
   */
  baseFilterAllQuery(
    mainPagingDTO: PagingDTO,
    filterQuery: BaseFilterGroup<PagingDTO>,
  ) {
    const where = {};
    where[getOperator(filterQuery.logical_operator)] = [];

    for (const condition of filterQuery.conditions) {
      let queryWhere;
      if (condition['logical_operator']) {
        queryWhere = this.baseFilterAllQuery(
          mainPagingDTO,
          condition as BaseFilterGroup<PagingDTO>,
        );
        if (!queryWhere) {
          continue;
        }
      } else {
        queryWhere = this.baseFilterQuery(
          mainPagingDTO,
          condition as BaseFilterInterfaceSingle<PagingDTO>,
        );
        if (!queryWhere) {
          continue;
        }
      }
      if (queryWhere) {
        where[getOperator(filterQuery.logical_operator)].push(queryWhere);
      }
    }

    if (where[getOperator(filterQuery.logical_operator)].length) {
      return where;
    }
  }

  /**
   * The function `baseFilterQuery` takes in a `mainPagingDTO` and a `filterQuery`, and returns a converted filter operator based on the provided parameters.
   * @param {PagingDTO} mainPagingDTO - The mainPagingDTO parameter is an object of type PagingDTO. It contains pagination-related information such as page number, page size, and sorting options.
   * @param filterQuery - The `filterQuery` parameter is an object that implements the
   * `BaseFilterInterfaceSingle` interface. It has the following properties:
   * @returns the result of the `convertFilterToOperator` function if the condition
   * `!convertFilterToOperator(field, comparator, mainPagingDTO[key])` is truthy. Otherwise, it returns the result of the `convertFilterToOperator` function if the condition `mainPagingDTO[key]` is truthy.
   */
  baseFilterQuery(
    mainPagingDTO: PagingDTO,
    filterQuery: BaseFilterInterfaceSingle<PagingDTO>,
  ) {
    const { field, comparator = '=', key } = filterQuery;
    if (!convertFilterToOperator(field, comparator, mainPagingDTO[key])) {
      return;
    }
    if (mainPagingDTO[key]) {
      return convertFilterToOperator(field, comparator, mainPagingDTO[key]);
    }
  }

  /**
   * The function `baseFindAllQuery` generates a query object with a `where` clause and a `sort` clause based on the provided `mainPagingDTO` object.
   * @param {PagingDTO} mainPagingDTO - PagingDTO object that contains information about pagination, sorting, and searching.
   * @returns an object with two properties: "where" and "sort".
   */
  baseFindAllQuery(mainPagingDTO: PagingDTO): { where: any; sort: any } {
    try {
      const where = {
        $and: [],
      };

      const filter = this.baseFilterAllQuery(
        mainPagingDTO,
        this.filterByFields,
      );
      if (filter) {
        where['$and'].push(filter);
      }

      if (mainPagingDTO.search && this.searchByFields.length) {
        const search = [];
        for (const fieldSearch of this.searchByFields) {
          const searchPerField = {
            [fieldSearch]: { $regex: new RegExp(mainPagingDTO.search, 'i') },
          };
          search.push(searchPerField);
        }
        where['$and'].push({
          $or: search,
        });
      }

      console.log(JSON.stringify(where));

      where['$and'].push({ deleted_at: null });

      const sort = {};
      if (mainPagingDTO.order && mainPagingDTO.sort) {
        sort[mainPagingDTO.sort] = mainPagingDTO.order == 'ASC' ? 1 : -1;
      } else {
        sort['updated_at'] = -1;
      }

      return { where, sort };
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * The function executes an aggregation pipeline on a repository, filtering and sorting the data, and returning a paginated list of results along with the total count.
   * @param {any} where - The `where` parameter is an object that specifies the conditions for filtering the data. It can contain one or more key-value pairs, where the key represents the field to filter on and the value represents the filter value.
   * @param sort - The `sort` parameter is an object that specifies the sorting criteria for the query results. It is optional and defaults to an empty object `{}`. The keys of the object represent the fields to sort by, and the values can be either `1` for ascending order or `-1` for descending
   * @param [page=0] - The `page` parameter is used to specify the page number of the results you want to retrieve.
   * @param [size=10] - The `size` parameter represents the number of items to be returned per page in the result.
   * @returns The `exec` function returns a promise that resolves to an object with two properties: `list` and `count`. The `list` property is an array of items, and the `count` property is a number representing the total count of items.
   */
  public async exec(
    where: any,
    sort = {},
    page = 0,
    size = 10,
  ): Promise<{
    list: any[];
    count: number;
  }> {
    try {
      const pipeline = [
        { $match: where },
        { $sort: sort },
        {
          $facet: {
            list: [{ $skip: page * size }, { $limit: size }],
            count: [{ $count: 'count' }],
          },
        },
      ];

      const result = await this.repository.aggregate(pipeline).exec();

      const roomListCount = {
        list: result[0].list,
        count: result[0].count.length > 0 ? result[0].count[0].count : 0,
      };

      return roomListCount;
    } catch (error: any) {
      this.logger.error(error.message);
      this.baseResponseService.throwError(error);
    }
  }

  /**
   * Find all entities in the database debug
   * @param mainPagingDTO - The DTO containing pagination data
   * @returns - The list of entities and pagination details
   */
  async findAll(mainPagingDTO: PagingDTO): Promise<ListPaginationInterface<T>> {
    try {
      const { where, sort } = this.baseFindAllQuery(mainPagingDTO);

      const roomListCount = await this.exec(
        where,
        sort,
        mainPagingDTO.page,
        mainPagingDTO.size,
      );
      const pagination: PaginationInterface = {
        page: mainPagingDTO.page,
        total: roomListCount.count,
        size: mainPagingDTO.size,
      };
      return {
        content: roomListCount.list,
        pagination,
      };
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
  async getAndValidateById(id: string): Promise<T> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestException(
          this.baseResponseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.baseMessageService.getErrorMessage(
                `${this.tableAlias}_id`,
                'general.general.data_invalid',
              ),
            ],
            'Bad Request',
          ),
        );
      }
      const recordT = await this.repository
        .findOne({ _id: id, deleted_at: null })
        .exec();
      if (!recordT) {
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
      return recordT;
    } catch (error: any) {
      Logger.error(error.message, '', this.constructor.name);
      this.baseResponseService.throwError(error);
    }
  }
}
