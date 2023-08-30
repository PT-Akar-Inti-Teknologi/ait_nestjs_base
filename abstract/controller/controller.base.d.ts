import { BaseService } from '../service/service.base';
import { PaginationRequestDTO } from '../../response/dto/request/pagination-request.dto';
import { ResponseSuccessCollectionDTO } from '../../response/dto/response/response-success-collection.dto';
import { ResponseSuccessSingleDTO } from '../../response/dto/response/response-success-single.dto';
import { ResponseService } from '../../response/service/response.service';
import { MessageService } from '../../response/service/message.service';
import { IUser } from '../../auth/guard/interface/user.interface';
/**
 * Base class for providing CRUD (Create, Read, Update, Delete) operations over HTTP (GET, POST, PUT, DELETE).
 * @template CreateDTO - The DTO used to create an entity
 * @template UpdateDTO - The DTO used to update an entity
 * @template EntityDocument - The entity document type
 */
export declare abstract class BaseController<CreateDTO, UpdateDTO, EntityDocument, PagingDTO extends PaginationRequestDTO = PaginationRequestDTO> {
    private readonly baseService;
    private readonly baseResponseService;
    private readonly baseMessageService;
    private readonly className;
    readonly logger: any;
    protected constructor(baseService: BaseService<CreateDTO, UpdateDTO, EntityDocument, PagingDTO>, baseResponseService: ResponseService, baseMessageService: MessageService, className: string);
    /**
     * GET endpoint to find all entities. This method can be overridden in child classes.
     * @param mainPagingDTO - The DTO containing pagination data
     * @returns - The HTTP response containing the list of entities and pagination details
     */
    findAll(mainPagingDTO: PagingDTO): Promise<ResponseSuccessCollectionDTO>;
    /**
     * GET endpoint to retrieve a single entity with detail. This method can be overridden in child classes.
     * @param id - The id of the entity to be retrieved
     * @returns - The HTTP response containing the retrieved entity
     */
    show(id: string): Promise<ResponseSuccessSingleDTO>;
    /**
     * POST endpoint to create a new entity. This method can be overridden in child classes.
     * @param createDTO - The DTO containing the data to create the entity
     * @param user
     * @returns - The HTTP response containing the created entity
     */
    save(createDTO: CreateDTO, user?: IUser): Promise<ResponseSuccessSingleDTO>;
    /**
     * PUT endpoint to update an existing entity. This method can be overridden in child classes.
     * @param id - The id of the entity to be updated
     * @param updateDTO - The DTO containing the data to update the entity
     * @param user
     * @returns - The HTTP response containing the updated entity
     */
    update(id: string, updateDTO: UpdateDTO, user?: IUser): Promise<ResponseSuccessSingleDTO>;
    /**
     * DELETE endpoint to delete an existing entity. This method can be overridden in child classes.
     * @param id - The id of the entity to be deleted
     * @returns - The HTTP response containing the result of the delete operation
     */
    delete(id: string): Promise<ResponseSuccessSingleDTO>;
    /**
     * This is an asynchronous function that returns a paginated collection of results obtained from a
     * base service.
     * @param mainPagingDTO - `mainPagingDTO` is an object that contains the parameters
     * for pagination and filtering of data. It is likely used to retrieve a subset of data from a larger
     * dataset, based on certain criteria such as page number, page size, sorting, and filtering. The
     * `baseService` is likely a
     * @returns a Promise that resolves to an object of type ResponseSuccessCollectionDTO. This
     * object is created by calling the successCollection method of the baseResponseService object,
     * passing in the content and pagination properties of the result object returned by calling the
     * findAll method of the baseService object with the mainPagingDTO parameter.
     */
    baseFindAll(mainPagingDTO: PagingDTO): Promise<ResponseSuccessCollectionDTO>;
    /**
     * This is an asynchronous function that retrieves a single entity document by ID and returns a
     * success response with the retrieved data.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of an
     * entity that needs to be retrieved from the database. The `baseShow` function is an asynchronous
     * function that takes in this `id` parameter and returns a Promise that resolves to a
     * `ResponseSuccessSingleDTO` object. The
     * @returns The function `baseShow` is returning a Promise that resolves to an object of type
     * `ResponseSuccessSingleDTO`. This object contains the `result` obtained from calling the
     * `getDetailAndValidateById` method of the `baseService`, and a success message obtained from the
     * `baseMessageService`.
     */
    baseShow(id: string): Promise<ResponseSuccessSingleDTO>;
    /**
     * This is an asynchronous function that saves a document entity and returns a success response with
     * a message.
     * @param createDTO - `createDTO` is an object that contains the data needed to create a
     * new entity. It is likely defined as an interface or a class that specifies the required properties
     * and their types. The `baseService.save()` method is called with this object as its argument to
     * create a new entity in the database
     * @returns The function `baseSave` is returning a Promise that resolves to an object of type
     * `ResponseSuccessSingleDTO`. This object contains the result of calling the `save` method of
     * the `baseService` with the `createDTO` parameter, and a success message obtained from the
     * `baseMessageService`.
     */
    baseSave(createDTO: CreateDTO): Promise<ResponseSuccessSingleDTO>;
    /**
     * This is an async function that updates an entity document and returns a success response with a
     * message.
     * @param updateDTO - updateDTO is an object that contains the updated data for an
     * entity. It is passed as an argument to the baseService.update() method, which updates the entity
     * with the new data.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
     * entity that needs to be updated. It is used by the `baseService.update()` method to locate the
     * entity in the database and update its properties based on the values provided in the `updateDTO`
     * parameter.
     * @returns A Promise that resolves to a ResponseSuccessSingleDTO object.
     */
    baseUpdate(updateDTO: UpdateDTO, id: string): Promise<ResponseSuccessSingleDTO>;
    /**
     * This is an asynchronous function that deletes a record by ID and returns a success response with a
     * message.
     * @param {string} id - The `id` parameter is a string representing the unique identifier of the
     * resource that needs to be deleted. It is used to identify the specific resource that needs to be
     * deleted from the database.
     * @returns a Promise that resolves to an object of type ResponseSuccessSingleDTO. This object
     * contains the result of a delete operation performed by the baseService, along with a success
     * message obtained from the baseMessageService.
     */
    baseDelete(id: string): Promise<ResponseSuccessSingleDTO>;
}
