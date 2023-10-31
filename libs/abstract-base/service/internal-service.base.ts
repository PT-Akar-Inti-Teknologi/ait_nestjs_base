import { plainToClass } from 'class-transformer';
import { ApplicationConfig, ModuleRef, Reflector } from '@nestjs/core';
import {
  getMetadataArgsStorage,
  DataSource,
  Repository,
  FindOptionsWhere,
  EntityTarget,
} from 'typeorm';
import {
  BadRequestException,
  ClassSerializerInterceptor,
  HttpStatus,
  Injectable,
  ValidationPipe,
  Logger,
} from '@nestjs/common';

import { MessageService } from '../../message/message.service';
import { ResponseService } from '../../response/response.service';
import { ValidationGroup } from './internal.constant';
import { ResponseSuccessSingleInterface } from '../../response/response.interface';

@Injectable()
export abstract class InternalServiceBase<
  BaseEntityInternal extends { id: string },
  EntityName extends string,
> {
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
  constructor(
    protected readonly responseService: ResponseService,
    protected readonly messageService: MessageService,
    protected readonly dataSource: DataSource,
    protected readonly moduleRef: ModuleRef,
  ) {
    moduleRef
      .get(ApplicationConfig)
      .useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  }

  protected abstract tablePrefix: string;

  /**
   * Dynamic repository by entity name
   *
   * @param entityName {string} {@link EntityName}
   * @return Object {@link Repository}
   */
  protected repositoryOf(
    entityName: EntityName,
  ): Repository<Partial<BaseEntityInternal>> {
    const entity = getMetadataArgsStorage().tables.find(
      (t) => t.name === `${this.tablePrefix}_${entityName.toLowerCase()}`,
    )?.target;

    if (!entity) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          [
            this.messageService.getErrorMessage(
              'entity name',
              'general.general.data_invalid',
            ),
          ],
          'Bad Request',
        ),
      );
    }

    return this.dataSource.getRepository(entity);
  }

  /**
   * Get reference (exisiting record by id)
   *
   * @param entityName {string} {@link EntityName}
   * @param id {string}
   * @return Promise<Object>
   */
  protected async referenceOf(
    entityName: EntityName,
    id: string,
  ): Promise<Partial<BaseEntityInternal>> {
    return this.repositoryOf(entityName)
      .findOneBy({ id } as FindOptionsWhere<BaseEntityInternal>)
      .then((reference) => {
        if (!reference) {
          throw new BadRequestException(
            this.responseService.error(
              HttpStatus.BAD_REQUEST,
              [
                this.messageService.getErrorMessage(
                  `${entityName}_id`,
                  'general.general.id_not_found',
                ),
              ],
              'Bad Request',
            ),
          );
        }

        return reference;
      });
  }

  /**
   * Convert plaintext Object to entity class
   * then validate all decorated rules
   *
   * @param isUpdate {boolean}
   * @param param {Object}
   * @param target {Object | Function}
   * @return Promise<Object>
   */
  public async toEntityAndValidate(
    isUpdate: boolean,
    param: Partial<BaseEntityInternal>,
    target: any,
  ): Promise<Partial<BaseEntityInternal>> {
    const entity: Partial<BaseEntityInternal> = plainToClass(target, param);

    const validator: any = this.moduleRef
      .get(ApplicationConfig)
      .getGlobalPipes()
      .find((pipe) => pipe instanceof ValidationPipe);

    if (validator) {
      const errors = await validator.validate(entity, {
        groups: isUpdate ? ValidationGroup.UPDATE : ValidationGroup.INSERT,
      });

      if (errors.length) {
        throw validator.exceptionFactory(errors);
      }
    }

    return entity;
  }

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
  protected normalizeRelation(
    param: Partial<BaseEntityInternal>,
  ): Partial<BaseEntityInternal> {
    Object.keys(param).forEach((key) => {
      if (key.endsWith('_id')) {
        const relationName = key.replace('_id', '');

        if (!param[relationName]) {
          param[relationName] = { id: param[key] };
        }
      }
    });

    return param;
  }

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
  protected async process(
    entityName: EntityName,
    id: string,
    param: Partial<BaseEntityInternal>,
  ): Promise<Partial<BaseEntityInternal>> {
    const repository = this.repositoryOf(entityName);
    const reference = id
      ? await this.referenceOf(entityName, id)
      : repository.create();

    if (param) {
      const entity = await this.toEntityAndValidate(
        !!id,
        this.normalizeRelation(param),
        repository.target,
      );

      Object.keys(entity).forEach((key) => {
        if (!id || key.toLowerCase() != 'id') {
          reference[key] = entity[key];
        }
      });
    }

    return reference;
  }

  public async add(
    entityName: EntityName,
    param: Partial<BaseEntityInternal>,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.responseService.success(
      await this.repositoryOf(entityName).save(
        await this.process(entityName, null, param),
      ),
      this.messageService.get('general.create.success'),
    );
  }

  public async update(
    entityName: EntityName,
    id: string,
    param: Partial<BaseEntityInternal>,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.responseService.success(
      await this.repositoryOf(entityName).save(
        await this.process(entityName, id, param),
      ),
      this.messageService.get('general.update.success'),
    );
  }

  public async delete(
    entityName: EntityName,
    id: string,
  ): Promise<ResponseSuccessSingleInterface> {
    return this.responseService.success(
      await this.repositoryOf(entityName).softRemove(
        await this.process(entityName, id, null),
      ),
      this.messageService.get('general.delete.success'),
    );
  }

  /**
   * Function to find detail by id and load all relations
   *
   * @param target {Object | Function} of {E}
   * @param id {string}
   * @protected
   */
  public findDetail<D>(target: EntityTarget<D>, id: string): Promise<D> {
    const repository = this.dataSource.getRepository(target);
    return repository.findOne({
      where: { id } as any,
      relations: repository.metadata.ownRelations
        .slice(0)
        .map((r) => r.propertyName),
    });
  }

  /**
   * Function to find detail by id without the relation
   *
   * @param target {Object | Function} of {E}
   * @param id {string}
   * @protected
   */
  public findShallow<D>(target: EntityTarget<D>, id: string): Promise<D> {
    const repository = this.dataSource.getRepository(target);
    return repository.findOne({
      where: { id } as any,
      relations: [],
    });
  }

  /**
   * Fetch an entity from the database and validate its existence
   * @param target {Object | Function} of {E}
   * @param fieldName - name of field to be checked, just in case it's error
   * @param id - The id of the entity to be fetched
   * @returns - The fetched entity
   */
  async getAndValidateById<D>(
    target: EntityTarget<D>,
    fieldName: string,
    id: string,
  ): Promise<D> {
    try {
      const recordEntityDocument = await this.findDetail(target, id);
      if (!recordEntityDocument) {
        throw new BadRequestException(
          this.responseService.error(
            HttpStatus.BAD_REQUEST,
            [
              this.messageService.getErrorMessage(
                fieldName,
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
      this.responseService.throwError(error);
    }
  }
}
