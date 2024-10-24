import {
  ValidateBy,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import moment from 'moment';
import { i18nValidationMessage } from 'nestjs-i18n';

export const DATE_NEWER_OR_SAME_WITH_FIELD = 'dateNewerOrSameWithField';

/**
 * date object should be higher or same as other field's date
 */
export function dateNewerOrSameWithField(
  value: unknown,
  args: ValidationArguments,
): boolean {
  const oldDate = moment(args.object[args.constraints[0]]);
  const newDate = moment(value);
  return oldDate <= newDate;
}

/**
 * date object should be higher or same as other field's date
 */
export function DateNewerOrSameWithField(
  otherFieldName: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: DATE_NEWER_OR_SAME_WITH_FIELD,
      constraints: [otherFieldName],
      validator: {
        validate: dateNewerOrSameWithField,
        defaultMessage: i18nValidationMessage(
          'validation_custom.DATE_NEWER_OR_SAME_WITH_FIELD',
        ),
      },
    },
    validationOptions,
  );
}
