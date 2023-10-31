import { I18nService } from 'nestjs-i18n';
import { MessageService } from '../message.service';
export declare class MessageI18nService extends MessageService {
    private i18nService;
    constructor(i18nService: I18nService);
    getRaw(key: string): Record<string, string> | string;
}
//# sourceMappingURL=message-i18n.service.d.ts.map