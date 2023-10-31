import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { MessageService } from '../message/message.service';
export declare class ResponseFilter implements ExceptionFilter {
    private readonly messageService;
    constructor(messageService: MessageService);
    catch(exception: any, host: ArgumentsHost): void;
}
//# sourceMappingURL=response.filter.d.ts.map