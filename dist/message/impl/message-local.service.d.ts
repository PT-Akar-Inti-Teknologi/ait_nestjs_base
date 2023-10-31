import { MessageService } from '../message.service';
import { AitMessageConfig } from '../interfaces';
export declare class MessageLocalService extends MessageService {
    private config;
    private translations;
    constructor(config: AitMessageConfig);
    getRaw(key: string): Record<string, string> | string;
}
//# sourceMappingURL=message-local.service.d.ts.map