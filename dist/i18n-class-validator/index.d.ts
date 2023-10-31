import * as classValidator from 'class-validator';
import { CountryCode } from 'libphonenumber-js';
export declare function Allow(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsDefined(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsOptional(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function ValidateNested(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function ValidatePromise(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsLatLong(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsLatitude(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsLongitude(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function Equals(comparison: any, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function NotEquals(comparison: any, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsEmpty(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsNotEmpty(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsIn(values: readonly any[], validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsNotIn(values: readonly any[], validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsDivisibleBy(num: number, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsPositive(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsNegative(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function Max(maxValue: number, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function Min(minValue: number, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function MinDate(date: Date, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function MaxDate(date: Date, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function Contains(seed: string, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function NotContains(seed: string, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsAlpha(locale?: string, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsAlphanumeric(locale?: string, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsDecimal(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsAscii(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsBase64(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsByteLength(min: number, max?: number, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsCreditCard(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsCurrency(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsEmail(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsFQDN(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsFullWidth(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsHalfWidth(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsVariableWidth(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsHexColor(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsHexadecimal(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsMacAddress(validationOptions?: classValidator.ValidationOptions): boolean;
export declare function IsIP(version?: classValidator.IsIpVersion, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsPort(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsISBN(version?: classValidator.IsISBNVersion, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsISIN(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsISO8601(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsJSON(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsJWT(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsLowercase(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsMobilePhone(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsISO31661Alpha2(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsISO31661Alpha3(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsMongoId(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsMultibyte(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsSurrogatePair(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsUrl(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsUUID(version?: classValidator.UUIDVersion, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsFirebasePushId(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsUppercase(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function Length(min: number, max?: number, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function MaxLength(max: number, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function MinLength(min: number, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function Matches(pattern: RegExp, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsPhoneNumber(region?: CountryCode, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsMilitaryTime(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsHash(algorithm: string, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsISSN(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsDateString(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsBooleanString(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsNumberString(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsBase32(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsBIC(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsBtcAddress(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsDataURI(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsEAN(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsEthereumAddress(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsHSL(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsIBAN(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsIdentityCard(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsISRC(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsLocale(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsMagnetURI(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsMimeType(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsOctal(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsPassportNumber(countryCode: string, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsPostalCode(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsRFC3339(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsRgbColor(includePercentValues?: boolean, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsSemVer(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsBoolean(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsDate(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsNumber(options?: classValidator.IsNumberOptions, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsEnum(entity: object, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsInt(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsString(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsArray(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsObject(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function ArrayContains(values: any[], validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function ArrayNotContains(values: any[], validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function ArrayNotEmpty(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function ArrayMinSize(min: number, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function ArrayMaxSize(max: number, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function ArrayUnique(validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsNotEmptyObject(options?: {
    nullable?: boolean;
}, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
export declare function IsInstance(targetType: new (...args: any[]) => any, validationOptions?: classValidator.ValidationOptions): PropertyDecorator;
//# sourceMappingURL=index.d.ts.map