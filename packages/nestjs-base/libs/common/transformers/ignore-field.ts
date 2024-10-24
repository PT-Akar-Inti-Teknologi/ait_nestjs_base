import {
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const IGNORE_FIELD = 'ignoreField';

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 * If null or undefined is given then this function returns false.
 */
export function ignoreField(_: unknown, args: ValidationArguments): boolean {
  delete args.object[args.property];
  return true;
}

/**
 * Checks if all array's values are unique. Comparison for objects is reference-based.
 * If null or undefined is given then this function returns false.
 */
export function IgnoreField(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IGNORE_FIELD,
      validator: {
        validate: ignoreField,
        defaultMessage: i18nValidationMessage('validation_custom.IGNORE_FIELD'),
      },
    },
    validationOptions,
  );
}
