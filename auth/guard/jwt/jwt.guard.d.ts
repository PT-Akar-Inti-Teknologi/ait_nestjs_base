import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MessageService } from '../../../response/service/message.service';
import { ResponseService } from '../../../response/service/response.service';
declare const JwtGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtGuard extends JwtGuard_base {
    private readonly responseService;
    private readonly messageService;
    private reflector;
    constructor(responseService: ResponseService, messageService: MessageService, reflector: Reflector);
    private user_type_and_levels;
    private permission;
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest(err: Error, user: any, info: Error): any;
}
export {};
