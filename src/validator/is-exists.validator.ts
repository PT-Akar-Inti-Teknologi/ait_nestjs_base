import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 *
 * @param key unique field from given entity
 * @param repository entity class that already extends BaseEntity class from typeorm
 * @param additionalField
 * @param validationOptions use this to override class-validator ValidationOptions
 * @returns
 */
export function IsExists(
  key: string,
  repository: any,
  additionalField?: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: ({ value, property }) =>
          `${property} with '${value}' is not exists`,
        ...validationOptions,
      },
      constraints: [key, repository, additionalField],
      validator: IsExistsConstraints,
    });
  };
}

@ValidatorConstraint({ name: 'IsExists', async: true })
export class IsExistsConstraints implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    try {
      const [key, repo] = args.constraints;
      const isExists = await repo.count({
        where: {
          [key]: value,
        },
        cache: {
          miliseconds: 30000,
        },
      });

      return isExists > 0;
    } catch (error) {
      return false;
    }
  }
}
