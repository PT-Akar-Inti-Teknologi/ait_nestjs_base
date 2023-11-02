import { Provider } from '@nestjs/common';
/** config for AIT Auth Module */
export declare class AitAuthConfig {
    /** secret key to validate jwt */
    jwtSecretKey: string;
    /** how long jwt will expire. available value reference: https://github.com/vercel/ms */
    jwtExpirationTime: string;
    /** how long refresh token will expire. available value reference: https://github.com/vercel/ms */
    refreshJwtExpirationTime: string;
    /** jwt strategy */
    jwtStrategy: Provider;
}
//# sourceMappingURL=auth-config.interface.d.ts.map