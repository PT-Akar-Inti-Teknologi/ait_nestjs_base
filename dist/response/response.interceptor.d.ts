import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MessageService } from '../message/message.service';
export declare class ResponseInterceptor implements NestInterceptor<Promise<any> | string> {
    private readonly messageService;
    constructor(messageService: MessageService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Promise<any> | string>>;
}
//# sourceMappingURL=response.interceptor.d.ts.map