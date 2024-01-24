/** config for hash module */
export class HashModuleConfig {
  /** length of generated salt, for example: `saltLength: Number(process.env.HASH_PASSWORDSALTLENGTH)` */
  saltLength?: number;
}
