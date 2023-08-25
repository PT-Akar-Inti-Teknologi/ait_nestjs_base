import { PaginationDTO } from '../dto/response/pagination.dto';
import { ErrorMessageDTO } from '../dto/response/error-message.dto';
import { ResponseErrorDTO } from '../dto/response/response-error.dto';
import { ResponseSuccessSingleDTO } from '../dto/response/response-success-single.dto';
import { ResponseSuccessCollectionDTO } from '../dto/response/response-success-collection.dto';
export declare class ResponseService {
    responseCode(statusCode: number): string;
    error(statusCode: number, messages: ErrorMessageDTO[], error: string): ResponseErrorDTO;
    successCollection(content: any[], pagination?: PaginationDTO, message?: string): ResponseSuccessCollectionDTO<any>;
    success(content: any, message?: string): ResponseSuccessSingleDTO;
    throwError(error: any): void;
}
