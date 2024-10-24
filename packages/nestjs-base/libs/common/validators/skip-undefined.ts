import { ValidateIf } from 'class-validator';

export function skipUndefined(_: any, value: any) {
  return value !== undefined;
}

export function SkipUndefined() {
  return ValidateIf(skipUndefined);
}
