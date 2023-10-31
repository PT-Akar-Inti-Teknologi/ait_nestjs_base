import { ErrorMessageInterface, ResponseErrorInterface, ResponseSuccessCollectionInterface, PaginationInterface, ResponseSuccessPaginationInterface, ResponseSuccessSingleInterface, ResponseServiceConfig } from './response.interface';
export declare class ResponseService {
    responseCode(statusCode: number): string;
    error(statusCode: number, messages: ErrorMessageInterface[], error: string): ResponseErrorInterface;
    successCollection(content: any[], pagination?: PaginationInterface, message?: string): ResponseSuccessCollectionInterface | ResponseSuccessPaginationInterface;
    success(content: any, message?: string): ResponseSuccessSingleInterface;
    throwError(error: any): void;
}
export declare class ResponseServiceImpl extends ResponseService {
    private readonly config;
    constructor(config: ResponseServiceConfig);
    responseCode(statusCode: number): string;
}
//# sourceMappingURL=response.service.d.ts.map