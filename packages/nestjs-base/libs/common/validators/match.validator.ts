import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Match(
  relatedPropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: ({ property }) => `${property} doesn't match`,
        ...validationOptions,
      },
      constraints: [relatedPropertyName],
      validator: MatchConstraints,
    });
  };
}

@ValidatorConstraint({ name: 'Match', async: false })
export class MatchConstraints implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = (validationArguments.object as any)[
      relatedPropertyName
    ];

    return value === relatedValue;
  }
}
