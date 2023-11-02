import { Abstract, DynamicModule, ForwardReference, Provider, Type } from '@nestjs/common';
/** config for AIT Auth Module */
export declare class AitAuthConfig {
    /** secret key to validate jwt */
    jwtSecretKey: string;
    /** how long jwt will expire. available value reference: https://github.com/vercel/ms */
    jwtExpirationTime: string;
    /** how long refresh token will expire. available value reference: https://github.com/vercel/ms */
    refreshJwtExpirationTime: string;
    /** jwt strategy, optional */
    jwtStrategy?: {
        strategy: Provider;
        /** additional imports */
        imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
        exports?: Array<DynamicModule | Promise<DynamicModule> | string | symbol | Provider | ForwardReference | Abstract<any> | Function>;
        /** additional providers */
        providers: Provider[];
    };
}
//# sourceMappingURL=auth-config.interface.d.ts.map