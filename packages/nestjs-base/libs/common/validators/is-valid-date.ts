import { ValidateBy, ValidationOptions } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

/**
 * Checks if given date is valid date
 */
export function IsValidDate(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'isValidDate',
      validator: {
        validate: (value): boolean => {
          const date = new Date(value);
          // Check if the date is valid and the date string matches the expected format
          return !isNaN(date.getTime()) && date.toISOString().startsWith(value);
        },
        defaultMessage: i18nValidationMessage(
          'validation_custom.IS_VALID_DATE',
        ),
      },
    },
    validationOptions,
  );
}
