import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
/**
 *
 * @param key unique field from given repository
 * @param repository entity that already extends BaseEntity class from typeorm
 * @param additionalField (optional) fill this parameters with field name of this object if you want to except row with field name identity
 * @param validationOptions use this to override class-validator ValidationOptions
 * @returns
 */
export declare function IsUnique(key: string, repository: any, additionalField?: string, validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
export declare class IsUniqueConstraints implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): Promise<boolean>;
}
//# sourceMappingURL=is-unique.validator.d.ts.map