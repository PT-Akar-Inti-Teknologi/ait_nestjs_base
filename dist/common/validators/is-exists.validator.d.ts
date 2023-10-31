import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
/**
 *
 * @param key unique field from given entity
 * @param repository entity class that already extends BaseEntity class from typeorm
 * @param validationOptions use this to override class-validator ValidationOptions
 * @returns
 */
export declare function IsExists(key: string, repository: any, additionalField?: string, validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
export declare class IsExistsConstraints implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): Promise<boolean>;
}
//# sourceMappingURL=is-exists.validator.d.ts.map