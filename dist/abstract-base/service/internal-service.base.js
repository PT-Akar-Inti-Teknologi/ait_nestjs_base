"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServiceBase = void 0;
const class_transformer_1 = require("class-transformer");
const core_1 = require("@nestjs/core");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const message_service_1 = require("../../message/message.service");
const response_service_1 = require("../../response/response.service");
const internal_constant_1 = require("./internal.constant");
let InternalServiceBase = class InternalServiceBase {
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
    constructor(responseService, messageService, dataSource, moduleRef) {
        this.responseService = responseService;
        this.messageService = messageService;
        this.dataSource = dataSource;
        this.moduleRef = moduleRef;
        moduleRef
            .get(core_1.ApplicationConfig)
            .useGlobalInterceptors(new common_1.ClassSerializerInterceptor(new core_1.Reflector()));
    }
    /**
     * Dynamic repository by entity name
     *
     * @param entityName {string} {@link EntityName}
     * @return Object {@link Repository}
     */
    repositoryOf(entityName) {
        var _a;
        const entity = (_a = (0, typeorm_1.getMetadataArgsStorage)().tables.find((t) => t.name === `${this.tablePrefix}_${entityName.toLowerCase()}`)) === null || _a === void 0 ? void 0 : _a.target;
        if (!entity) {
            throw new common_1.BadRequestException(this.responseService.error(common_1.HttpStatus.BAD_REQUEST, [
                this.messageService.getErrorMessage('entity name', 'general.general.data_invalid'),
            ], 'Bad Request'));
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
    async referenceOf(entityName, id) {
        return this.repositoryOf(entityName)
            .findOneBy({ id })
            .then((reference) => {
            if (!reference) {
                throw new common_1.BadRequestException(this.responseService.error(common_1.HttpStatus.BAD_REQUEST, [
                    this.messageService.getErrorMessage(`${entityName}_id`, 'general.general.id_not_found'),
                ], 'Bad Request'));
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
    async toEntityAndValidate(isUpdate, param, target) {
        const entity = (0, class_transformer_1.plainToClass)(target, param);
        const validator = this.moduleRef
            .get(core_1.ApplicationConfig)
            .getGlobalPipes()
            .find((pipe) => pipe instanceof common_1.ValidationPipe);
        if (validator) {
            const errors = await validator.validate(entity, {
                groups: isUpdate ? internal_constant_1.ValidationGroup.UPDATE : internal_constant_1.ValidationGroup.INSERT,
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
    normalizeRelation(param) {
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
    async process(entityName, id, param) {
        const repository = this.repositoryOf(entityName);
        const reference = id
            ? await this.referenceOf(entityName, id)
            : repository.create();
        if (param) {
            const entity = await this.toEntityAndValidate(!!id, this.normalizeRelation(param), repository.target);
            Object.keys(entity).forEach((key) => {
                if (!id || key.toLowerCase() != 'id') {
                    reference[key] = entity[key];
                }
            });
        }
        return reference;
    }
    async add(entityName, param) {
        return this.responseService.success(await this.repositoryOf(entityName).save(await this.process(entityName, null, param)), this.messageService.get('general.create.success'));
    }
    async update(entityName, id, param) {
        return this.responseService.success(await this.repositoryOf(entityName).save(await this.process(entityName, id, param)), this.messageService.get('general.update.success'));
    }
    async delete(entityName, id) {
        return this.responseService.success(await this.repositoryOf(entityName).softRemove(await this.process(entityName, id, null)), this.messageService.get('general.delete.success'));
    }
    /**
     * Function to find detail by id and load all relations
     *
     * @param target {Object | Function} of {E}
     * @param id {string}
     * @protected
     */
    findDetail(target, id) {
        const repository = this.dataSource.getRepository(target);
        return repository.findOne({
            where: { id },
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
    findShallow(target, id) {
        const repository = this.dataSource.getRepository(target);
        return repository.findOne({
            where: { id },
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
    async getAndValidateById(target, fieldName, id) {
        try {
            const recordEntityDocument = await this.findDetail(target, id);
            if (!recordEntityDocument) {
                throw new common_1.BadRequestException(this.responseService.error(common_1.HttpStatus.BAD_REQUEST, [
                    this.messageService.getErrorMessage(fieldName, 'general.general.id_not_found'),
                ], 'Bad Request'));
            }
            return recordEntityDocument;
        }
        catch (error) {
            common_1.Logger.error(error.message, '', this.constructor.name);
            this.responseService.throwError(error);
        }
    }
};
InternalServiceBase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [response_service_1.ResponseService,
        message_service_1.MessageService,
        typeorm_1.DataSource,
        core_1.ModuleRef])
], InternalServiceBase);
exports.InternalServiceBase = InternalServiceBase;
//# sourceMappingURL=internal-service.base.js.map