import { ValidateBy, ValidationOptions } from 'class-validator';
import moment from 'moment';
import { i18nValidationMessage } from 'nestjs-i18n';

export const DATE_MINIMUM_TODAY = 'dateMinimumToday';

/**
 * date object should be higher or same as today (GMT+7)
 */
export function dateMinimumToday(value: unknown): boolean {
  const oldDate = moment().utcOffset(7).startOf('day');
  const newDate = moment(value);
  return oldDate <= newDate;
}

/**
 * date object should be higher or same as today (GMT+7)
 */
export function DateMinimumToday(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: DATE_MINIMUM_TODAY,
      validator: {
        validate: dateMinimumToday,
        defaultMessage: i18nValidationMessage(
          'validation_custom.DATE_MINIMUM_TODAY',
        ),
      },
    },
    validationOptions,
  );
}
