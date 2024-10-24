import {
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const ARRAY_NESTED_UNIQUE = 'arrayNestedUnique';
export type ArrayNestedUniqueIdentifier<T = any> = (o: T) => any;

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 * If null or undefined is given then this function returns false.
 */
export function arrayNestedUnique<T = any>(
  array: T[],
  args: ValidationArguments,
): boolean {
  if (!Array.isArray(array)) return false;

  const identifier = args.constraints[0];

  const set = new Set();
  array.forEach((o) => set.add(o[identifier]));

  return array.length === set.size;
}

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 * If null or undefined is given then this function returns false.
 */
export function ArrayNestedUnique<T = any>(
  identifier: keyof T,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: ARRAY_NESTED_UNIQUE,
      constraints: [identifier],
      validator: {
        validate: arrayNestedUnique,
        defaultMessage: i18nValidationMessage(
          'validation_custom.ARRAY_NESTED_UNIQUE',
        ),
      },
    },
    validationOptions,
  );
}
