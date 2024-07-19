import * as classValidator from 'class-validator';
import { CountryCode } from 'libphonenumber-js';
import { i18nValidationMessage } from 'nestjs-i18n';

function mergeI18nOptions(
  key: string,
  validationOptions?: classValidator.ValidationOptions,
): classValidator.ValidationOptions {
  return {
    message: i18nValidationMessage(`validation.${key}`),
    ...validationOptions,
  };
}

export function Allow(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.Allow(validationOptions);
}
export function IsDefined(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsDefined(
    mergeI18nOptions('IS_DEFINED', validationOptions),
  );
}
export function IsOptional(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsOptional(validationOptions);
}
export function ValidateNested(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.ValidateNested(validationOptions);
}
export function ValidatePromise(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.ValidatePromise(validationOptions);
}
export function IsLatLong(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsLatLong(
    mergeI18nOptions('IS_LATLONG', validationOptions),
  );
}
export function IsLatitude(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsLatitude(
    mergeI18nOptions('IS_LATITUDE', validationOptions),
  );
}
export function IsLongitude(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsLongitude(
    mergeI18nOptions('IS_LONGITUDE', validationOptions),
  );
}
export function Equals(
  comparison: any,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.Equals(
    comparison,
    mergeI18nOptions('EQUALS', validationOptions),
  );
}
export function NotEquals(
  comparison: any,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.NotEquals(
    comparison,
    mergeI18nOptions('NOT_EQUALS', validationOptions),
  );
}
export function IsEmpty(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsEmpty(
    mergeI18nOptions('IS_EMPTY', validationOptions),
  );
}
export function IsNotEmpty(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsNotEmpty(
    mergeI18nOptions('IS_NOT_EMPTY', validationOptions),
  );
}
export function IsIn(
  values: readonly any[],
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsIn(
    values,
    mergeI18nOptions('IS_IN', validationOptions),
  );
}
export function IsNotIn(
  values: readonly any[],
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsNotIn(
    values,
    mergeI18nOptions('IS_NOT_IN', validationOptions),
  );
}
export function IsDivisibleBy(
  num: number,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsDivisibleBy(
    num,
    mergeI18nOptions('IS_DIVISIBLE_BY', validationOptions),
  );
}
export function IsPositive(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsPositive(
    mergeI18nOptions('IS_POSITIVE', validationOptions),
  );
}
export function IsNegative(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsNegative(
    mergeI18nOptions('IS_NEGATIVE', validationOptions),
  );
}
export function Max(
  maxValue: number,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.Max(
    maxValue,
    mergeI18nOptions('MAX', validationOptions),
  );
}
export function Min(
  minValue: number,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.Min(
    minValue,
    mergeI18nOptions('MIN', validationOptions),
  );
}
export function MinDate(
  date: Date,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.MinDate(
    date,
    mergeI18nOptions('MIN_DATE', validationOptions),
  );
}
export function MaxDate(
  date: Date,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.MaxDate(
    date,
    mergeI18nOptions('MAX_DATE', validationOptions),
  );
}
export function Contains(
  seed: string,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.Contains(
    seed,
    mergeI18nOptions('CONTAINS', validationOptions),
  );
}
export function NotContains(
  seed: string,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.NotContains(
    seed,
    mergeI18nOptions('NOT_CONTAINS', validationOptions),
  );
}
export function IsAlpha(
  locale?: validator.AlphaLocale,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsAlpha(
    locale,
    mergeI18nOptions('IS_ALPHA', validationOptions),
  );
}
export function IsAlphanumeric(
  locale?: validator.AlphaLocale,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsAlphanumeric(
    locale,
    mergeI18nOptions('IS_ALPHANUMERIC', validationOptions),
  );
}
export function IsDecimal(
  options?: validator.IsDecimalOptions,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsDecimal(
    options,
    mergeI18nOptions('IS_DECIMAL', validationOptions),
  );
}
export function IsAscii(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsAscii(
    mergeI18nOptions('IS_ASCII', validationOptions),
  );
}
export function IsBase64(
  options?: validator.IsBase64Options,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsBase64(
    options,
    mergeI18nOptions('IS_BASE64', validationOptions),
  );
}
export function IsByteLength(
  min: number,
  max?: number,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsByteLength(
    min,
    max,
    mergeI18nOptions('IS_BYTE_LENGTH', validationOptions),
  );
}
export function IsCreditCard(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsCreditCard(
    mergeI18nOptions('IS_CREDIT_CARD', validationOptions),
  );
}
export function IsCurrency(
  options?: validator.IsCurrencyOptions,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsCurrency(
    options,
    mergeI18nOptions('IS_CURRENCY', validationOptions),
  );
}
export function IsEmail(
  options?: validator.IsEmailOptions,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsEmail(
    options,
    mergeI18nOptions('IS_EMAIL', validationOptions),
  );
}
export function IsFQDN(
  options?: validator.IsFQDNOptions,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsFQDN(
    options,
    mergeI18nOptions('IS_FQDN', validationOptions),
  );
}
export function IsFullWidth(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsFullWidth(
    mergeI18nOptions('IS_FULL_WIDTH', validationOptions),
  );
}
export function IsHalfWidth(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsHalfWidth(
    mergeI18nOptions('IS_HALF_WIDTH', validationOptions),
  );
}
export function IsVariableWidth(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsVariableWidth(
    mergeI18nOptions('IS_VARIABLE_WIDTH', validationOptions),
  );
}
export function IsHexColor(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsHexColor(
    mergeI18nOptions('IS_HEX_COLOR', validationOptions),
  );
}
export function IsHexadecimal(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsHexadecimal(
    mergeI18nOptions('IS_HEXADECIMAL', validationOptions),
  );
}
export function IsMacAddress(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.isMACAddress(
    mergeI18nOptions('IS_MAC_ADDRESS', validationOptions),
  );
}
export function IsIP(
  version?: classValidator.IsIpVersion,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsIP(
    version,
    mergeI18nOptions('IS_IP', validationOptions),
  );
}
export function IsPort(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsPort(mergeI18nOptions('IS_PORT', validationOptions));
}
export function IsISBN(
  version?: classValidator.IsISBNVersion,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsISBN(
    version,
    mergeI18nOptions('IS_ISBN', validationOptions),
  );
}
export function IsISIN(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsISIN(mergeI18nOptions('IS_ISIN', validationOptions));
}
export function IsISO8601(
  options?: validator.IsISO8601Options,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsISO8601(
    options,
    mergeI18nOptions('IS_ISO8601', validationOptions),
  );
}
export function IsJSON(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsJSON(mergeI18nOptions('IS_JSON', validationOptions));
}
export function IsJWT(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsJWT(mergeI18nOptions('IS_JWT', validationOptions));
}
export function IsLowercase(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsLowercase(
    mergeI18nOptions('IS_LOWERCASE', validationOptions),
  );
}
export function IsMobilePhone(
  locale?: validator.MobilePhoneLocale,
  options?: validator.IsMobilePhoneOptions,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsMobilePhone(
    locale,
    options,
    mergeI18nOptions('IS_MOBILE_PHONE', validationOptions),
  );
}
export function IsISO31661Alpha2(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsISO31661Alpha2(
    mergeI18nOptions('IS_ISO31661_ALPHA_2', validationOptions),
  );
}
export function IsISO31661Alpha3(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsISO31661Alpha3(
    mergeI18nOptions('IS_ISO31661_ALPHA_3', validationOptions),
  );
}
export function IsMongoId(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsMongoId(
    mergeI18nOptions('IS_MONGO_ID', validationOptions),
  );
}
export function IsMultibyte(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsMultibyte(
    mergeI18nOptions('IS_MULTIBYTE', validationOptions),
  );
}
export function IsSurrogatePair(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsSurrogatePair(
    mergeI18nOptions('IS_SURROGATE_PAIR', validationOptions),
  );
}
export function IsUrl(
  options?: validator.IsURLOptions,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsUrl(
    options,
    mergeI18nOptions('IS_URL', validationOptions),
  );
}
export function IsUUID(
  version?: validator.UUIDVersion,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsUUID(
    version,
    mergeI18nOptions('IS_UUID', validationOptions),
  );
}
export function IsFirebasePushId(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsFirebasePushId(
    mergeI18nOptions('IS_FIREBASE_PUSH_ID', validationOptions),
  );
}
export function IsUppercase(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsUppercase(
    mergeI18nOptions('IS_UPPERCASE', validationOptions),
  );
}
export function Length(
  min: number,
  max?: number,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.Length(
    min,
    max,
    mergeI18nOptions('IS_LENGTH', validationOptions),
  );
}
export function MaxLength(
  max: number,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.MaxLength(
    max,
    mergeI18nOptions('MAX_LENGTH', validationOptions),
  );
}
export function MinLength(
  min: number,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.MinLength(
    min,
    mergeI18nOptions('MIN_LENGTH', validationOptions),
  );
}
export function Matches(
  pattern: RegExp,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.Matches(
    pattern,
    mergeI18nOptions('MATCHES', validationOptions),
  );
}
export function IsPhoneNumber(
  region?: CountryCode,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsPhoneNumber(
    region,
    mergeI18nOptions('IS_PHONE_NUMBER', validationOptions),
  );
}
export function IsMilitaryTime(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsMilitaryTime(
    mergeI18nOptions('IS_MILITARY_TIME', validationOptions),
  );
}
export function IsHash(
  algorithm: string,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsHash(
    algorithm,
    mergeI18nOptions('IS_HASH', validationOptions),
  );
}
export function IsISSN(
  options?: validator.IsISSNOptions,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsISSN(
    options,
    mergeI18nOptions('IS_ISSN', validationOptions),
  );
}
export function IsDateString(
  options?: validator.IsISO8601Options,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsDateString(
    options,
    mergeI18nOptions('IS_DATE_STRING', validationOptions),
  );
}
export function IsBooleanString(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsBooleanString(
    mergeI18nOptions('IS_BOOLEAN_STRING', validationOptions),
  );
}
export function IsNumberString(
  options?: validator.IsNumericOptions,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsNumberString(
    options,
    mergeI18nOptions('IS_NUMBER_STRING', validationOptions),
  );
}
export function IsBase32(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsBase32(
    mergeI18nOptions('IS_BASE32', validationOptions),
  );
}
export function IsBIC(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsBIC(mergeI18nOptions('IS_BIC', validationOptions));
}
export function IsBtcAddress(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsBtcAddress(
    mergeI18nOptions('IS_BTC_ADDRESS', validationOptions),
  );
}
export function IsDataURI(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsDataURI(
    mergeI18nOptions('IS_DATA_URI', validationOptions),
  );
}
export function IsEAN(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsEAN(mergeI18nOptions('IS_EAN', validationOptions));
}
export function IsEthereumAddress(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsEthereumAddress(
    mergeI18nOptions('IS_ETHEREUM_ADDRESS', validationOptions),
  );
}
export function IsHSL(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsHSL(mergeI18nOptions('IS_HSL', validationOptions));
}
export function IsIBAN(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsIBAN(mergeI18nOptions('IS_IBAN', validationOptions));
}
export function IsIdentityCard(
  locale?: validator.IdentityCardLocale,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsIdentityCard(
    locale,
    mergeI18nOptions('IS_IDENTITY_CARD', validationOptions),
  );
}
export function IsISRC(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsISRC(mergeI18nOptions('IS_ISRC', validationOptions));
}
export function IsLocale(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsLocale(
    mergeI18nOptions('IS_LOCALE', validationOptions),
  );
}
export function IsMagnetURI(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsMagnetURI(
    mergeI18nOptions('IS_MAGNET_URI', validationOptions),
  );
}
export function IsMimeType(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsMimeType(
    mergeI18nOptions('IS_MIME_TYPE', validationOptions),
  );
}
export function IsOctal(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsOctal(
    mergeI18nOptions('IS_OCTAL', validationOptions),
  );
}
export function IsPassportNumber(
  countryCode: string,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsPassportNumber(
    countryCode,
    mergeI18nOptions('IS_PASSPORT_NUMBER', validationOptions),
  );
}
export function IsPostalCode(
  locale?: validator.PostalCodeLocale,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsPostalCode(
    locale,
    mergeI18nOptions('IS_POSTAL_CODE', validationOptions),
  );
}
export function IsRFC3339(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsRFC3339(
    mergeI18nOptions('IS_RFC_3339', validationOptions),
  );
}
export function IsRgbColor(
  includePercentValues?: boolean,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsRgbColor(
    includePercentValues,
    mergeI18nOptions('IS_RGB_COLOR', validationOptions),
  );
}
export function IsSemVer(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsSemVer(
    mergeI18nOptions('IS_SEM_VER', validationOptions),
  );
}
export function IsBoolean(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsBoolean(
    mergeI18nOptions('IS_BOOLEAN', validationOptions),
  );
}
export function IsDate(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsDate(mergeI18nOptions('IS_DATE', validationOptions));
}
export function IsNumber(
  options?: classValidator.IsNumberOptions,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsNumber(
    options,
    mergeI18nOptions('IS_NUMBER', validationOptions),
  );
}
export function IsEnum(
  entity: object,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsEnum(
    entity,
    mergeI18nOptions('IS_ENUM', validationOptions),
  );
  return classValidator.IsEnum(mergeI18nOptions('IS_ENUM', validationOptions));
}
export function IsInt(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsInt(mergeI18nOptions('IS_INT', validationOptions));
}
export function IsString(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsString(
    mergeI18nOptions('IS_STRING', validationOptions),
  );
}
export function IsArray(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsArray(
    mergeI18nOptions('IS_ARRAY', validationOptions),
  );
}
export function IsObject(validationOptions?: classValidator.ValidationOptions) {
  return classValidator.IsObject(
    mergeI18nOptions('IS_OBJECT', validationOptions),
  );
}
export function ArrayContains(
  values: any[],
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.ArrayContains(
    values,
    mergeI18nOptions('ARRAY_CONTAINS', validationOptions),
  );
}
export function ArrayNotContains(
  values: any[],
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.ArrayNotContains(
    values,
    mergeI18nOptions('ARRAY_NOT_CONTAINS', validationOptions),
  );
}
export function ArrayNotEmpty(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.ArrayNotEmpty(
    mergeI18nOptions('ARRAY_NOT_EMPTY', validationOptions),
  );
}
export function ArrayMinSize(
  min: number,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.ArrayMinSize(
    min,
    mergeI18nOptions('ARRAY_MIN_SIZE', validationOptions),
  );
}
export function ArrayMaxSize(
  max: number,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.ArrayMaxSize(
    max,
    mergeI18nOptions('ARRAY_MAX_SIZE', validationOptions),
  );
}
export function ArrayUnique(
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.ArrayUnique(
    mergeI18nOptions('ARRAY_UNIQUE', validationOptions),
  );
}
export function IsNotEmptyObject(
  options?: {
    nullable?: boolean;
  },
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsNotEmptyObject(
    options,
    mergeI18nOptions('IS_NOT_EMPTY_OBJECT', validationOptions),
  );
}
export function IsInstance(
  targetType: new (...args: any[]) => any,
  validationOptions?: classValidator.ValidationOptions,
) {
  return classValidator.IsInstance(
    targetType,
    mergeI18nOptions('IS_INSTANCE', validationOptions),
  );
}
