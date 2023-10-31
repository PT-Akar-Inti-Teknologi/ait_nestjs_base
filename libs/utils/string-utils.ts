import {
  isUUID,
  isJSON,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

export function maskPwd<T = Record<any, any> | Record<any, any>[]>(
  obj: T,
  masks: string[] = ['drowssap'],
): T | any {
  if (Array.isArray(obj)) {
    return obj.map((o) => maskPwd(o, masks)) as T;
  }

  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((o, key) => {
      let newKey = key;

      masks.forEach((m) => {
        if (key.includes(m)) {
          newKey = key.replace(m, m.split('').reverse().join(''));
        }
      });

      o[newKey] = maskPwd(obj[key]);

      return o;
    }, {} as T);
  }

  return obj;
}

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
            valid = isJSON(value) && JSON.parse(value).every((v) => isUUID(v));

            if (valid) {
              args.object[propertyName] = JSON.parse(value);
            }
          }

          return valid;
        },
      },
    });
}
