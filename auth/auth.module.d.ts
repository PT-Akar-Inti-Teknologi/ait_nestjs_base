import { DynamicModule } from '@nestjs/common';
interface AuthOptions {
    enableAuthPermissionController?: boolean;
}
export declare class AuthModule {
    static forRoot(options: AuthOptions): DynamicModule;
}
export {};
