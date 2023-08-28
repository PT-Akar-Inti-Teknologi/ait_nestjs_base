import { ErrorMessageDTO } from '../dto/response/error-message.dto';
export declare class MessageService {
    private static get language();
    get(key: string): string;
    getErrorMessage(field: string, key: string): ErrorMessageDTO;
    getRequestErrorsMessage(requestErrors: Record<string, any>[]): string;
}
