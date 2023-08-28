import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Not } from 'typeorm';

/**
 *
 * @param key unique field from given repository
 * @param repository entity that already extends BaseEntity class from typeorm
 * @param additionalField (optional) fill this parameters with field name of this object if you want to except row with field name identity
 * @param validationOptions use this to override class-validator ValidationOptions
 * @returns
 */
export function IsUnique(
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
          `${property} with ${value} is already registered`,
        ...validationOptions,
      },
      constraints: [key, repository, additionalField],
      validator: IsUniqueConstraints,
    });
  };
}

@ValidatorConstraint({ name: 'IsUnique', async: true })
export class IsUniqueConstraints implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    try {
      if (value.length === 0) return true;

      const [key, repo, additionalField] = args.constraints;
      const additionalFieldValue = (args.object as any)[additionalField];

      const where: { [x: string]: any } = {
        [key]: value,
      };

      if (additionalField) {
        where.additionalField = Not(additionalFieldValue);
      }

      const isExists = await repo.countBy(where);

      return isExists === 0;
    } catch (error) {
      return false;
    }
  }
}
