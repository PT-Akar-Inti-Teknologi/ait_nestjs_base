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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const common_1 = require("@nestjs/common");
const main_paging_dto_1 = require("../../common/dto/main-paging.dto");
const class_transformer_1 = require("class-transformer");
/**
 * Base class for providing CRUD (Create, Read, Update, Delete) operations over HTTP (GET, POST, PUT, DELETE).
 * @template CreateDTO - The DTO used to create an entity
 * @template UpdateDTO - The DTO used to update an entity
 * @template EntityDocument - The entity document type
 */
class BaseController {
    constructor(baseService, baseResponseService, baseMessageService, className, pagingClass = main_paging_dto_1.MainPagingDTO) {
        this.baseService = baseService;
        this.baseResponseService = baseResponseService;
        this.baseMessageService = baseMessageService;
        this.className = className;
        this.pagingClass = pagingClass;
        this.logger = new common_1.Logger(className);
    }
    /**
     * GET endpoint to find all entities. This method can be overridden in child classes.
     * @param mainPagingDTO - The DTO containing pagination data
     * @returns - The HTTP response containing the list of entities and pagination details
     */
    async findAll(mainPagingDTO) {
        if (!(mainPagingDTO instanceof main_paging_dto_1.MainPagingDTO)) {
            mainPagingDTO = (0, class_transformer_1.plainToClass)(this.pagingClass, mainPagingDTO);
        }
        return this.baseFindAll(mainPagingDTO);
    }
    /**
     * GET endpoint to retrieve a single entity with detail. This method can be overridden in child classes.
     * @param id - The id of the entity to be retrieved
     * @returns - The HTTP response containing the retrieved entity
     */
    async show(id) {
        return this.baseShow(id);
    }
    /**
     * POST endpoint to create a new entity. This method can be overridden in child classes.
     * @param createDTO - The DTO containing the data to create the entity
     * @returns - The HTTP response containing the created entity
     */
    async save(createDTO, user) {
        return this.baseSave(createDTO);
    }
    /**
     * PUT endpoint to update an existing entity. This method can be overridden in child classes.
     * @param id - The id of the entity to be updated
     * @param updateDTO - The DTO containing the data to update the entity
     * @returns - The HTTP response containing the updated entity
     */
    async update(id, updateDTO, user) {
        return this.baseUpdate(updateDTO, id);
    }
    /**
     * DELETE endpoint to delete an existing entity. This method can be overridden in child classes.
     * @param id - The id of the entity to be deleted
     * @returns - The HTTP response containing the result of the delete operation
     */
    async delete(id) {
        return this.baseDelete(id);
    }
    /**
     * This is an asynchronous function that returns a paginated collection of results obtained from a
     * base service.
     * @param {PagingDTO} mainPagingDTO - `mainPagingDTO` is an object that contains the parameters
     * for pagination and filtering of data. It is likely used to retrieve a subset of data from a larger
     * dataset, based on certain criteria such as page number, page size, sorting, and filtering. The
     * `baseService` is likely a
     * @returns a Promise that resolves to an object of type ResponseSuccessPaginationInterface. This
     * object is created by calling the successCollection method of the baseResponseService object,
     * passing in the content and pagination properties of the result object returned by calling the
     * findAll method of the baseService object with the mainPagingDTO parameter.
     */
    async baseFindAll(mainPagingDTO) {
        const result = await this.baseService.findAll(mainPagingDTO);
        return this.baseResponseService.successCollection(result.content, result.pagination);
    }
    /**
     * This is an asynchronous function that retrieves a single entity document by ID and returns a
     * success response with the retrieved data.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of an
     * entity that needs to be retrieved from the database. The `baseShow` function is an asynchronous
     * function that takes in this `id` parameter and returns a Promise that resolves to a
     * `ResponseSuccessSingleInterface` object. The
     * @returns The function `baseShow` is returning a Promise that resolves to an object of type
     * `ResponseSuccessSingleInterface`. This object contains the `result` obtained from calling the
     * `getDetailAndValidateById` method of the `baseService`, and a success message obtained from the
     * `baseMessageService`.
     */
    async baseShow(id) {
        const result = await this.baseService.getDetailAndValidateById(id);
        return this.baseResponseService.success(result, this.baseMessageService.get('general.get.success'));
    }
    /**
     * This is an asynchronous function that saves a document entity and returns a success response with
     * a message.
     * @param {CreateDTO} createDTO - `createDTO` is an object that contains the data needed to create a
     * new entity. It is likely defined as an interface or a class that specifies the required properties
     * and their types. The `baseService.save()` method is called with this object as its argument to
     * create a new entity in the database
     * @returns The function `baseSave` is returning a Promise that resolves to an object of type
     * `ResponseSuccessSingleInterface`. This object contains the result of calling the `save` method of
     * the `baseService` with the `createDTO` parameter, and a success message obtained from the
     * `baseMessageService`.
     */
    async baseSave(createDTO) {
        const result = await this.baseService.save(createDTO);
        return this.baseResponseService.success(result, this.baseMessageService.get('general.create.success'));
    }
    /**
     * This is an async function that updates an entity document and returns a success response with a
     * message.
     * @param {UpdateDTO} updateDTO - updateDTO is an object that contains the updated data for an
     * entity. It is passed as an argument to the baseService.update() method, which updates the entity
     * with the new data.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
     * entity that needs to be updated. It is used by the `baseService.update()` method to locate the
     * entity in the database and update its properties based on the values provided in the `updateDTO`
     * parameter.
     * @returns A Promise that resolves to a ResponseSuccessSingleInterface object.
     */
    async baseUpdate(updateDTO, id) {
        const result = await this.baseService.update(updateDTO, id);
        return this.baseResponseService.success(result, this.baseMessageService.get('general.update.success'));
    }
    /**
     * This is an asynchronous function that deletes a record by ID and returns a success response with a
     * message.
     * @param {string} id - The `id` parameter is a string representing the unique identifier of the
     * resource that needs to be deleted. It is used to identify the specific resource that needs to be
     * deleted from the database.
     * @returns a Promise that resolves to an object of type ResponseSuccessSingleInterface. This object
     * contains the result of a delete operation performed by the baseService, along with a success
     * message obtained from the baseMessageService.
     */
    async baseDelete(id) {
        const result = await this.baseService.delete(id);
        return this.baseResponseService.success(result, this.baseMessageService.get('general.delete.success'));
    }
}
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "show", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "save", null);
__decorate([
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "delete", null);
exports.BaseController = BaseController;
//# sourceMappingURL=controller.base.js.map