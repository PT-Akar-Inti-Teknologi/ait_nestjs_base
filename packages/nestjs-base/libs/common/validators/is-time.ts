import { ValidateBy, ValidationOptions } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export const IS_TIME = 'isTime';

/**
 * Checks if given value is time formatted (`00:00` ~ `23:59`).
 */
export function isTime(value: unknown): boolean {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

/**
 * Checks if given value is time formatted (`00:00` ~ `23:59`).
 */
export function IsTime(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: IS_TIME,
      validator: {
        validate: (value): boolean => isTime(value),
        defaultMessage: i18nValidationMessage('validation_custom.IS_TIME'),
      },
    },
    validationOptions,
  );
}
