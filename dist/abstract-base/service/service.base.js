"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
/**
 * Base class for providing generic CRUD (Create, Read, Update, Delete) operations.
 * @template CreateDTO - The DTO used to create an entity
 * @template UpdateDTO - The DTO used to update an entity
 * @template EntityDocument - The entity document type
 */
class BaseService {
    constructor(repository, baseResponseService, baseMessageService, className) {
        this.repository = repository;
        this.baseResponseService = baseResponseService;
        this.baseMessageService = baseMessageService;
        this.className = className;
        this.relations = [];
        this.searchByFields = ['name'];
        this.defaultSort = 'created_at';
        this.defaultOrder = 'DESC';
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
        this.filterByFields = [];
        this.logger = new common_1.Logger(`${className}.${BaseService.name}`);
    }
    /**
     * Save an entity in the database. This method can be overridden in child classes.
     * @param createDTO - The DTO containing the data to be saved
     * @returns - The saved entity
     */
    async save(createDTO) {
        return this.baseSave(createDTO);
    }
    /**
     * Update an entity in the database. This method can be overridden in child classes.
     * @param updateDTO - The DTO containing the data to be updated
     * @param id - The id of the entity to be updated
     * @returns - The updated entity
     */
    async update(updateDTO, id) {
        return this.baseUpdate(updateDTO, id);
    }
    /**
     * Delete an entity from the database. This method can be overridden in child classes.
     * @param id - The id of the entity to be deleted
     * @returns - Result of the delete operation
     */
    async delete(id) {
        return this.baseDelete(id);
    }
    /**
     * Find all entities in the database. This method can be overridden in child classes.
     * @param mainPagingDTO - The DTO containing pagination data
     * @returns - The list of entities and pagination details
     */
    async findAll(mainPagingDTO) {
        return this.baseFindAll(mainPagingDTO);
    }
    /**
     * Save an entity in the database
     * @param createDTO - The DTO containing the data to be saved
     * @returns - The saved entity
     */
    async baseSave(createDTO) {
        try {
            const entitySave = Object.assign({}, createDTO);
            return this.repository.save(entitySave);
        }
        catch (error) {
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
    async baseUpdate(updateDTO, id) {
        try {
            const record = await this.getAndValidateById(id);
            Object.assign(record, Object.assign({}, updateDTO));
            return this.repository.save(record);
        }
        catch (error) {
            this.logger.error(error.message);
            this.baseResponseService.throwError(error);
        }
    }
    /**
     * Delete an entity from the database
     * @param id - The id of the entity to be deleted
     * @returns - Result of the delete operation
     */
    async baseDelete(id) {
        try {
            await this.getAndValidateById(id);
            return this.repository.softDelete(id);
        }
        catch (error) {
            this.logger.error(error.message);
            this.baseResponseService.throwError(error);
        }
    }
    /**
     * Find all entities in the database
     * @param mainPagingDTO - The DTO containing pagination data
     * @returns - The list of entities and pagination details
     */
    async baseFindAll(mainPagingDTO) {
        const query = await this.baseFindAllQuery(mainPagingDTO);
        try {
            const result = await query.getManyAndCount();
            const pagination = {
                page: mainPagingDTO.page,
                total: result[1],
                size: mainPagingDTO.size,
            };
            return {
                content: result[0],
                pagination,
            };
        }
        catch (error) {
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
    baseFilterQuery(mainPagingDTO, filterQuery, queryBuilder) {
        const { logical_operator = 'and', field, comparator = '=', key, } = filterQuery;
        if (mainPagingDTO[key] === undefined)
            return;
        // build query string
        let operation = `${field} ${comparator} :${key}`;
        if (comparator.toUpperCase() == 'IN') {
            operation = `${field} ${comparator} (:...${key})`;
        }
        else if (comparator.toUpperCase() == 'NOT NULL') {
            queryBuilder.orWhere(`${field} IS ${mainPagingDTO[key] ? 'NOT NULL' : 'NULL'}`);
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
    baseFilterAllQuery(mainPagingDTO, filterQueries, queryBuilder) {
        for (const filterQuery of filterQueries) {
            if (Array.isArray(filterQuery)) {
                queryBuilder.andWhere(new typeorm_1.Brackets((qb) => {
                    this.baseFilterAllQuery(mainPagingDTO, filterQuery, qb);
                }));
            }
            else {
                this.baseFilterQuery(mainPagingDTO, filterQuery, queryBuilder);
            }
        }
    }
    /**
     * Query builder to find all entities in the database
     * @param mainPagingDTO - The DTO containing pagination data
     * @returns - The list of entities and pagination details
     */
    async baseFindAllQuery(mainPagingDTO) {
        try {
            const query = this.repository.createQueryBuilder(this.tableAlias);
            if (mainPagingDTO.search) {
                query.where(new typeorm_1.Brackets((qb) => {
                    for (const fieldSearch of this.searchByFields) {
                        qb.orWhere(`${fieldSearch} ilike :search`, {
                            search: `%${mainPagingDTO.search}%`,
                        });
                    }
                }));
            }
            this.baseFilterAllQuery(mainPagingDTO, this.filterByFields, query);
            if (mainPagingDTO.order && mainPagingDTO.sort) {
                let prefix = '';
                if (!mainPagingDTO.sort.includes('.')) {
                    prefix = `${this.tableAlias}.`;
                }
                query.orderBy(`${prefix}${mainPagingDTO.sort}`, mainPagingDTO.order);
            }
            else {
                query.orderBy(`${this.tableAlias}.created_at`, 'DESC');
            }
            query.take(mainPagingDTO.size);
            query.skip(mainPagingDTO.page * mainPagingDTO.size);
            return query;
        }
        catch (error) {
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
    async baseFindDetailAll(mainPagingDTO, relations) {
        const query = await this.baseFindDetailAllQuery(mainPagingDTO, relations);
        try {
            const result = await query.getManyAndCount();
            const pagination = {
                page: mainPagingDTO.page,
                total: result[1],
                size: mainPagingDTO.size,
            };
            return {
                content: result[0],
                pagination,
            };
        }
        catch (error) {
            this.logger.error(error.message);
            this.baseResponseService.throwError(error);
        }
    }
    /**
     * use `this.searchByFields` to add search query if `mainPagingDTO.search` exists
     * @param queryBuilder - query builder
     * @param {PagingDTO} mainPagingDTO - The mainPagingDTO parameter is an object that contains
     */
    baseSearchAllQuery(queryBuilder, mainPagingDTO) {
        if (mainPagingDTO.search) {
            queryBuilder.where(new typeorm_1.Brackets((qb) => {
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
            }));
        }
    }
    /**
     * use `relations` or `this.relations` data to add join query to existing query
     * @param queryBuilder - query builder
     * @param {string[]} relations - optional parameter to override `this.relations`
     */
    baseAddJoinQuery(queryBuilder, relations) {
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
    async baseFindDetailAllQuery(mainPagingDTO, relations) {
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
            }
            else {
                query.orderBy(`${this.tableAlias}.${this.defaultSort}`, this.defaultOrder);
            }
            query.take(mainPagingDTO.size);
            query.skip(mainPagingDTO.page * mainPagingDTO.size);
            return query;
        }
        catch (error) {
            this.logger.error(error.message);
            this.baseResponseService.throwError(error);
        }
    }
    /**
     * Fetch an entity from the database and validate its existence
     * @param id - The id of the entity to be fetched
     * @returns - The fetched entity
     */
    async getAndValidateById(id) {
        try {
            const recordEntityDocument = await this.repository
                .createQueryBuilder(this.tableAlias)
                .where(`${this.tableAlias}.id = :id`, { id })
                .getOne();
            if (!recordEntityDocument) {
                throw new common_1.BadRequestException(this.baseResponseService.error(common_1.HttpStatus.BAD_REQUEST, [
                    this.baseMessageService.getErrorMessage(`${this.tableAlias}_id`, 'general.general.id_not_found'),
                ], 'Bad Request'));
            }
            return recordEntityDocument;
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
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
    async getAndValidateByField(field, value) {
        try {
            const recordEntityDocument = await this.repository
                .createQueryBuilder(this.tableAlias)
                .where(`${this.tableAlias}.${field} = :value`, { value })
                .getOne();
            if (!recordEntityDocument) {
                throw new common_1.BadRequestException(this.baseResponseService.error(common_1.HttpStatus.BAD_REQUEST, [
                    this.baseMessageService.getErrorMessage(field, 'general.general.data_not_found'),
                ], 'Bad Request'));
            }
            return recordEntityDocument;
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            this.baseResponseService.throwError(error);
        }
    }
    /**
     * Generate query to fetch detailed entity from the database
     * @param id - The id of the entity to be fetched
     * @returns - Query builder
     */
    getDetailByIdQuery(id) {
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
        throw new common_1.BadRequestException(this.baseResponseService.error(common_1.HttpStatus.BAD_REQUEST, [
            this.baseMessageService.getErrorMessage('id', 'general.general.id_not_found'),
        ], 'Bad Request'));
    }
    /**
     * Fetch detailed entity from the database and validate its existence
     * @param id - The id of the entity to be fetched
     * @returns - The fetched detailed entity
     */
    async getDetailAndValidateById(id) {
        try {
            const queryBuilder = this.getDetailByIdQuery(id);
            const recordEntityDocument = await queryBuilder.getOne();
            if (!recordEntityDocument) {
                this.throwGenericNotFound();
            }
            return recordEntityDocument;
        }
        catch (error) {
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
    async isUnique(field, value, exludeId = null) {
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
                throw new common_1.BadRequestException(this.baseResponseService.error(common_1.HttpStatus.BAD_REQUEST, [
                    this.baseMessageService.getErrorMessage(field, `general.general.${field}_exist`),
                ], 'Bad Request'));
            }
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            this.baseResponseService.throwError(error);
        }
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=service.base.js.map