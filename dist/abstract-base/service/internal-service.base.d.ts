import { ModuleRef } from '@nestjs/core';
import { DataSource, Repository, EntityTarget } from 'typeorm';
import { MessageService } from '../../message/message.service';
import { ResponseService } from '../../response/response.service';
import { ResponseSuccessSingleInterface } from '../../response/response.interface';
export declare abstract class InternalServiceBase<BaseEntityInternal extends {
    id: string;
}, EntityName extends string> {
    protected readonly responseService: ResponseService;
    protected readonly messageService: MessageService;
    protected readonly dataSource: DataSource;
    protected readonly moduleRef: ModuleRef;
    /**
     * Dynamic service for internal
     * Add SerializerInterceptor to ignore property
     * (to support exclude private field)
     *
     * @param responseService {Object} {@link ResponseService}
     * @param messageService {Object} {@link MessageService}
     * @param dataSource {Object} {@link DataSource}
     * @param moduleRef {Object} {@link ModuleRef}
     */
    constructor(responseService: ResponseService, messageService: MessageService, dataSource: DataSource, moduleRef: ModuleRef);
    protected abstract tablePrefix: string;
    /**
     * Dynamic repository by entity name
     *
     * @param entityName {string} {@link EntityName}
     * @return Object {@link Repository}
     */
    protected repositoryOf(entityName: EntityName): Repository<Partial<BaseEntityInternal>>;
    /**
     * Get reference (exisiting record by id)
     *
     * @param entityName {string} {@link EntityName}
     * @param id {string}
     * @return Promise<Object>
     */
    protected referenceOf(entityName: EntityName, id: string): Promise<Partial<BaseEntityInternal>>;
    /**
     * Convert plaintext Object to entity class
     * then validate all decorated rules
     *
     * @param isUpdate {boolean}
     * @param param {Object}
     * @param target {Object | Function}
     * @return Promise<Object>
     */
    toEntityAndValidate(isUpdate: boolean, param: Partial<BaseEntityInternal>, target: any): Promise<Partial<BaseEntityInternal>>;
    /**
     * Normalize relation object, because we use direct object
     * Ex: some api like this {
     *   country: {id: '####', name: '####'},
     *   country_id: ####
     * } but we use only {
     *   country: {id: '####', name: '####'},
     * }
     * so we handle country_id to country field if no country in param
     * @param param
     * @protected
     */
    protected normalizeRelation(param: Partial<BaseEntityInternal>): Partial<BaseEntityInternal>;
    /**
     * Processing param or by id
     * to merge into reference (new or update)
     * then hook validator
     *
     * @param entityName {string} {@link EntityName}
     * @param id {string}
     * @param param {Object}
     * @protected {Object} ready to save record
     */
    protected process(entityName: EntityName, id: string, param: Partial<BaseEntityInternal>): Promise<Partial<BaseEntityInternal>>;
    add(entityName: EntityName, param: Partial<BaseEntityInternal>): Promise<ResponseSuccessSingleInterface>;
    update(entityName: EntityName, id: string, param: Partial<BaseEntityInternal>): Promise<ResponseSuccessSingleInterface>;
    delete(entityName: EntityName, id: string): Promise<ResponseSuccessSingleInterface>;
    /**
     * Function to find detail by id and load all relations
     *
     * @param target {Object | Function} of {E}
     * @param id {string}
     * @protected
     */
    findDetail<D>(target: EntityTarget<D>, id: string): Promise<D>;
    /**
     * Function to find detail by id without the relation
     *
     * @param target {Object | Function} of {E}
     * @param id {string}
     * @protected
     */
    findShallow<D>(target: EntityTarget<D>, id: string): Promise<D>;
    /**
     * Fetch an entity from the database and validate its existence
     * @param target {Object | Function} of {E}
     * @param fieldName - name of field to be checked, just in case it's error
     * @param id - The id of the entity to be fetched
     * @returns - The fetched entity
     */
    getAndValidateById<D>(target: EntityTarget<D>, fieldName: string, id: string): Promise<D>;
}
//# sourceMappingURL=internal-service.base.d.ts.map