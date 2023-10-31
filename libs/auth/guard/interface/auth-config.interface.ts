/** config for AIT Auth Module */
export class AitAuthConfig {
  /** secret key to validate jwt */
  jwtSecretKey: string;
  /** how long jwt will expire. available value reference: https://github.com/vercel/ms */
  jwtExpirationTime: string;
  /** how long refresh token will expire. available value reference: https://github.com/vercel/ms */
  refreshJwtExpirationTime: string;
}
