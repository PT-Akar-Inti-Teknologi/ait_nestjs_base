import {
  Abstract,
  DynamicModule,
  ForwardReference,
  Provider,
  Type,
} from '@nestjs/common';
/** config for AIT Auth Module */
export class AitAuthConfig {
  /** secret key to validate jwt */
  jwtSecretKey: string;
  /** how long jwt will expire. available value reference: https://github.com/vercel/ms */
  jwtExpirationTime: string;
  /** how long refresh token will expire. available value reference: https://github.com/vercel/ms */
  refreshJwtExpirationTime: string;
  /** jwt strategy, optional */
  // eslint-disable-next-line @typescript-eslint/ban-types
  jwtStrategy?: {
    strategy: Provider;
    /** additional imports */
    imports?: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    >;
    exports?: Array<
      | DynamicModule
      | Promise<DynamicModule>
      | string
      | symbol
      | Provider
      | ForwardReference
      | Abstract<any>
      // eslint-disable-next-line @typescript-eslint/ban-types
      | Function
    >;
    /** additional providers */
    providers: Provider[];
  };
  /** superadmin role */
  superadmin_role?: string;
  /** superadmin bypass checking by default, default true */
  superadmin_bypass?: boolean;
}
