import { ErrorMessageDTO } from '../dto/response/error-message.dto';
export declare class MessageService {
    private readonly languages;
    private readonly selectedLanguage;
    constructor(languages: Record<string, any>, selectedLanguage: string);
    get(key: string): string;
    getErrorMessage(field: string, key: string): ErrorMessageDTO;
    getRequestErrorsMessage(requestErrors: Record<string, any>[]): string;
}
