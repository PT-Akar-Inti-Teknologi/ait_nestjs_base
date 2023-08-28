import {
  isUUID,
  isJSON,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

/**
 * Convert and validate string json array to array uuid
 * @constructor
 */
export function JsonArrayToArrayUUID() {
  return (object: any, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: { message: `${propertyName} must json array string of uuid` },
      validator: {
        validate(value: any, args: ValidationArguments) {
          let valid = value === void 0;

          if (!valid) {
            valid =
              isJSON(value) &&
              JSON.parse(value).every((v: any) => {
                return !v || isUUID(v);
              });

            if (valid) {
              Object.defineProperty(args.object, propertyName, {
                value: JSON.parse(value),
              });
            }
          }

          return valid;
        },
      },
    });
}
