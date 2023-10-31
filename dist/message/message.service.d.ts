import { ErrorMessageInterface } from '../response/response.interface';
export declare class MessageService {
    getRaw(key: string): Record<string, string> | string;
    get(key: string): string;
    getErrorMessage(field: string, key: string): ErrorMessageInterface;
    getRequestErrorsMessage(requestErrors: Record<string, any>[]): string;
}
//# sourceMappingURL=message.service.d.ts.map