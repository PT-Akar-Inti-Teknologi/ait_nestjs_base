/** config for audit trail module */
export class AitAuditTrailConfig {
  /**
   * pattern/string to be ignored in audit trail.
   * to make sure this works properly, use string to use exact match,
   * use pattern/regex to have a contains match, default to ignore
   * field containing 'password'.
   * */
  ignores: (string | RegExp)[] = [/password/];
}
