import { Expose, Transform } from 'class-transformer';
import { ValidateIf } from 'class-validator';

/**
 * keep value if condition function returns true
 */
export function WhitelistIf(
  condition: (object: any, value: any) => boolean,
  defaultValue?: any,
): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    Expose()(target, propertyName);
    Transform(({ obj, value }) => {
      if (condition(obj, value))
        return value === undefined ? defaultValue : value;
      else return undefined;
    })(target, propertyName);
  };
}

/**
 * keep value if condition function returns true
 */
export function ValidateAndWhitelistIf(
  condition: (object: any, value: any) => boolean,
  defaultValue?: any,
): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    WhitelistIf(condition, defaultValue)(target, propertyName);
    ValidateIf(condition)(target, propertyName);
  };
}
