import { PaginationDTO } from '../dto/response/PaginationDTO';
import { ErrorMessageDTO } from '../dto/response/ErrorMessageDTO';
import { ResponseErrorDTO } from '../dto/response/ResponseErrorDTO';
import { ResponseSuccessSingleDTO } from '../dto/response/ResponseSuccessSingleDTO';
import { ResponseSuccessCollectionDTO } from '../dto/response/ResponseSuccessCollectionDTO';
export declare class ResponseService {
    responseCode(statusCode: number): string;
    error(statusCode: number, messages: ErrorMessageDTO[], error: string): ResponseErrorDTO;
    successCollection(content: any[], pagination?: PaginationDTO, message?: string): ResponseSuccessCollectionDTO<any>;
    success(content: any, message?: string): ResponseSuccessSingleDTO;
    throwError(error: any): void;
}
