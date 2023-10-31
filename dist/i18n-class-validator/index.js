"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsISO31661Alpha3 = exports.IsISO31661Alpha2 = exports.IsMobilePhone = exports.IsLowercase = exports.IsJWT = exports.IsJSON = exports.IsISO8601 = exports.IsISIN = exports.IsISBN = exports.IsPort = exports.IsIP = exports.IsMacAddress = exports.IsHexadecimal = exports.IsHexColor = exports.IsVariableWidth = exports.IsHalfWidth = exports.IsFullWidth = exports.IsFQDN = exports.IsEmail = exports.IsCurrency = exports.IsCreditCard = exports.IsByteLength = exports.IsBase64 = exports.IsAscii = exports.IsDecimal = exports.IsAlphanumeric = exports.IsAlpha = exports.NotContains = exports.Contains = exports.MaxDate = exports.MinDate = exports.Min = exports.Max = exports.IsNegative = exports.IsPositive = exports.IsDivisibleBy = exports.IsNotIn = exports.IsIn = exports.IsNotEmpty = exports.IsEmpty = exports.NotEquals = exports.Equals = exports.IsLongitude = exports.IsLatitude = exports.IsLatLong = exports.ValidatePromise = exports.ValidateNested = exports.IsOptional = exports.IsDefined = exports.Allow = void 0;
exports.ArrayMaxSize = exports.ArrayMinSize = exports.ArrayNotEmpty = exports.ArrayNotContains = exports.ArrayContains = exports.IsObject = exports.IsArray = exports.IsString = exports.IsInt = exports.IsEnum = exports.IsNumber = exports.IsDate = exports.IsBoolean = exports.IsSemVer = exports.IsRgbColor = exports.IsRFC3339 = exports.IsPostalCode = exports.IsPassportNumber = exports.IsOctal = exports.IsMimeType = exports.IsMagnetURI = exports.IsLocale = exports.IsISRC = exports.IsIdentityCard = exports.IsIBAN = exports.IsHSL = exports.IsEthereumAddress = exports.IsEAN = exports.IsDataURI = exports.IsBtcAddress = exports.IsBIC = exports.IsBase32 = exports.IsNumberString = exports.IsBooleanString = exports.IsDateString = exports.IsISSN = exports.IsHash = exports.IsMilitaryTime = exports.IsPhoneNumber = exports.Matches = exports.MinLength = exports.MaxLength = exports.Length = exports.IsUppercase = exports.IsFirebasePushId = exports.IsUUID = exports.IsUrl = exports.IsSurrogatePair = exports.IsMultibyte = exports.IsMongoId = void 0;
exports.IsInstance = exports.IsNotEmptyObject = exports.ArrayUnique = void 0;
const classValidator = __importStar(require("class-validator"));
const nestjs_i18n_1 = require("nestjs-i18n");
function mergeI18nOptions(key, validationOptions) {
    return Object.assign({ message: (0, nestjs_i18n_1.i18nValidationMessage)(`validation.${key}`) }, validationOptions);
}
function Allow(validationOptions) {
    return classValidator.Allow(validationOptions);
}
exports.Allow = Allow;
function IsDefined(validationOptions) {
    return classValidator.IsDefined(mergeI18nOptions('IS_DEFINED', validationOptions));
}
exports.IsDefined = IsDefined;
function IsOptional(validationOptions) {
    return classValidator.IsOptional(validationOptions);
}
exports.IsOptional = IsOptional;
function ValidateNested(validationOptions) {
    return classValidator.ValidateNested(validationOptions);
}
exports.ValidateNested = ValidateNested;
function ValidatePromise(validationOptions) {
    return classValidator.ValidatePromise(validationOptions);
}
exports.ValidatePromise = ValidatePromise;
function IsLatLong(validationOptions) {
    return classValidator.IsLatLong(mergeI18nOptions('IS_LATLONG', validationOptions));
}
exports.IsLatLong = IsLatLong;
function IsLatitude(validationOptions) {
    return classValidator.IsLatitude(mergeI18nOptions('IS_LATITUDE', validationOptions));
}
exports.IsLatitude = IsLatitude;
function IsLongitude(validationOptions) {
    return classValidator.IsLongitude(mergeI18nOptions('IS_LONGITUDE', validationOptions));
}
exports.IsLongitude = IsLongitude;
function Equals(comparison, validationOptions) {
    return classValidator.Equals(comparison, mergeI18nOptions('EQUALS', validationOptions));
}
exports.Equals = Equals;
function NotEquals(comparison, validationOptions) {
    return classValidator.NotEquals(comparison, mergeI18nOptions('NOT_EQUALS', validationOptions));
}
exports.NotEquals = NotEquals;
function IsEmpty(validationOptions) {
    return classValidator.IsEmpty(mergeI18nOptions('IS_EMPTY', validationOptions));
}
exports.IsEmpty = IsEmpty;
function IsNotEmpty(validationOptions) {
    return classValidator.IsNotEmpty(mergeI18nOptions('IS_NOT_EMPTY', validationOptions));
}
exports.IsNotEmpty = IsNotEmpty;
function IsIn(values, validationOptions) {
    return classValidator.IsIn(values, mergeI18nOptions('IS_IN', validationOptions));
}
exports.IsIn = IsIn;
function IsNotIn(values, validationOptions) {
    return classValidator.IsNotIn(values, mergeI18nOptions('IS_NOT_IN', validationOptions));
}
exports.IsNotIn = IsNotIn;
function IsDivisibleBy(num, validationOptions) {
    return classValidator.IsDivisibleBy(num, mergeI18nOptions('IS_DIVISIBLE_BY', validationOptions));
}
exports.IsDivisibleBy = IsDivisibleBy;
function IsPositive(validationOptions) {
    return classValidator.IsPositive(mergeI18nOptions('IS_POSITIVE', validationOptions));
}
exports.IsPositive = IsPositive;
function IsNegative(validationOptions) {
    return classValidator.IsNegative(mergeI18nOptions('IS_NEGATIVE', validationOptions));
}
exports.IsNegative = IsNegative;
function Max(maxValue, validationOptions) {
    return classValidator.Max(maxValue, mergeI18nOptions('MAX', validationOptions));
}
exports.Max = Max;
function Min(minValue, validationOptions) {
    return classValidator.Min(minValue, mergeI18nOptions('MIN', validationOptions));
}
exports.Min = Min;
function MinDate(date, validationOptions) {
    return classValidator.MinDate(date, mergeI18nOptions('MIN_DATE', validationOptions));
}
exports.MinDate = MinDate;
function MaxDate(date, validationOptions) {
    return classValidator.MaxDate(date, mergeI18nOptions('MAX_DATE', validationOptions));
}
exports.MaxDate = MaxDate;
function Contains(seed, validationOptions) {
    return classValidator.Contains(seed, mergeI18nOptions('CONTAINS', validationOptions));
}
exports.Contains = Contains;
function NotContains(seed, validationOptions) {
    return classValidator.NotContains(seed, mergeI18nOptions('NOT_CONTAINS', validationOptions));
}
exports.NotContains = NotContains;
function IsAlpha(locale, validationOptions) {
    return classValidator.IsAlpha(locale, mergeI18nOptions('IS_ALPHA', validationOptions));
}
exports.IsAlpha = IsAlpha;
function IsAlphanumeric(locale, validationOptions) {
    return classValidator.IsAlphanumeric(locale, mergeI18nOptions('IS_ALPHANUMERIC', validationOptions));
}
exports.IsAlphanumeric = IsAlphanumeric;
function IsDecimal(validationOptions) {
    return classValidator.IsDecimal(mergeI18nOptions('IS_DECIMAL', validationOptions));
}
exports.IsDecimal = IsDecimal;
function IsAscii(validationOptions) {
    return classValidator.IsAscii(mergeI18nOptions('IS_ASCII', validationOptions));
}
exports.IsAscii = IsAscii;
function IsBase64(validationOptions) {
    return classValidator.IsBase64(mergeI18nOptions('IS_BASE64', validationOptions));
}
exports.IsBase64 = IsBase64;
function IsByteLength(min, max, validationOptions) {
    return classValidator.IsByteLength(min, max, mergeI18nOptions('IS_BYTE_LENGTH', validationOptions));
}
exports.IsByteLength = IsByteLength;
function IsCreditCard(validationOptions) {
    return classValidator.IsCreditCard(mergeI18nOptions('IS_CREDIT_CARD', validationOptions));
}
exports.IsCreditCard = IsCreditCard;
function IsCurrency(validationOptions) {
    return classValidator.IsCurrency(mergeI18nOptions('IS_CURRENCY', validationOptions));
}
exports.IsCurrency = IsCurrency;
function IsEmail(validationOptions) {
    return classValidator.IsEmail(mergeI18nOptions('IS_EMAIL', validationOptions));
}
exports.IsEmail = IsEmail;
function IsFQDN(validationOptions) {
    return classValidator.IsFQDN(mergeI18nOptions('IS_FQDN', validationOptions));
}
exports.IsFQDN = IsFQDN;
function IsFullWidth(validationOptions) {
    return classValidator.IsFullWidth(mergeI18nOptions('IS_FULL_WIDTH', validationOptions));
}
exports.IsFullWidth = IsFullWidth;
function IsHalfWidth(validationOptions) {
    return classValidator.IsHalfWidth(mergeI18nOptions('IS_HALF_WIDTH', validationOptions));
}
exports.IsHalfWidth = IsHalfWidth;
function IsVariableWidth(validationOptions) {
    return classValidator.IsVariableWidth(mergeI18nOptions('IS_VARIABLE_WIDTH', validationOptions));
}
exports.IsVariableWidth = IsVariableWidth;
function IsHexColor(validationOptions) {
    return classValidator.IsHexColor(mergeI18nOptions('IS_HEX_COLOR', validationOptions));
}
exports.IsHexColor = IsHexColor;
function IsHexadecimal(validationOptions) {
    return classValidator.IsHexadecimal(mergeI18nOptions('IS_HEXADECIMAL', validationOptions));
}
exports.IsHexadecimal = IsHexadecimal;
function IsMacAddress(validationOptions) {
    return classValidator.isMACAddress(mergeI18nOptions('IS_MAC_ADDRESS', validationOptions));
}
exports.IsMacAddress = IsMacAddress;
function IsIP(version, validationOptions) {
    return classValidator.IsIP(version, mergeI18nOptions('IS_IP', validationOptions));
}
exports.IsIP = IsIP;
function IsPort(validationOptions) {
    return classValidator.IsPort(mergeI18nOptions('IS_PORT', validationOptions));
}
exports.IsPort = IsPort;
function IsISBN(version, validationOptions) {
    return classValidator.IsISBN(version, mergeI18nOptions('IS_ISBN', validationOptions));
}
exports.IsISBN = IsISBN;
function IsISIN(validationOptions) {
    return classValidator.IsISIN(mergeI18nOptions('IS_ISIN', validationOptions));
}
exports.IsISIN = IsISIN;
function IsISO8601(validationOptions) {
    return classValidator.IsISO8601(mergeI18nOptions('IS_ISO8601', validationOptions));
}
exports.IsISO8601 = IsISO8601;
function IsJSON(validationOptions) {
    return classValidator.IsJSON(mergeI18nOptions('IS_JSON', validationOptions));
}
exports.IsJSON = IsJSON;
function IsJWT(validationOptions) {
    return classValidator.IsJWT(mergeI18nOptions('IS_JWT', validationOptions));
}
exports.IsJWT = IsJWT;
function IsLowercase(validationOptions) {
    return classValidator.IsLowercase(mergeI18nOptions('IS_LOWERCASE', validationOptions));
}
exports.IsLowercase = IsLowercase;
function IsMobilePhone(validationOptions) {
    return classValidator.IsMobilePhone(mergeI18nOptions('IS_MOBILE_PHONE', validationOptions));
}
exports.IsMobilePhone = IsMobilePhone;
function IsISO31661Alpha2(validationOptions) {
    return classValidator.IsISO31661Alpha2(mergeI18nOptions('IS_ISO31661_ALPHA_2', validationOptions));
}
exports.IsISO31661Alpha2 = IsISO31661Alpha2;
function IsISO31661Alpha3(validationOptions) {
    return classValidator.IsISO31661Alpha3(mergeI18nOptions('IS_ISO31661_ALPHA_3', validationOptions));
}
exports.IsISO31661Alpha3 = IsISO31661Alpha3;
function IsMongoId(validationOptions) {
    return classValidator.IsMongoId(mergeI18nOptions('IS_MONGO_ID', validationOptions));
}
exports.IsMongoId = IsMongoId;
function IsMultibyte(validationOptions) {
    return classValidator.IsMultibyte(mergeI18nOptions('IS_MULTIBYTE', validationOptions));
}
exports.IsMultibyte = IsMultibyte;
function IsSurrogatePair(validationOptions) {
    return classValidator.IsSurrogatePair(mergeI18nOptions('IS_SURROGATE_PAIR', validationOptions));
}
exports.IsSurrogatePair = IsSurrogatePair;
function IsUrl(validationOptions) {
    return classValidator.IsUrl(mergeI18nOptions('IS_URL', validationOptions));
}
exports.IsUrl = IsUrl;
function IsUUID(version, validationOptions) {
    return classValidator.IsUUID(version, mergeI18nOptions('IS_UUID', validationOptions));
}
exports.IsUUID = IsUUID;
function IsFirebasePushId(validationOptions) {
    return classValidator.IsFirebasePushId(mergeI18nOptions('IS_FIREBASE_PUSH_ID', validationOptions));
}
exports.IsFirebasePushId = IsFirebasePushId;
function IsUppercase(validationOptions) {
    return classValidator.IsUppercase(mergeI18nOptions('IS_UPPERCASE', validationOptions));
}
exports.IsUppercase = IsUppercase;
function Length(min, max, validationOptions) {
    return classValidator.Length(min, max, mergeI18nOptions('IS_LENGTH', validationOptions));
}
exports.Length = Length;
function MaxLength(max, validationOptions) {
    return classValidator.MaxLength(max, mergeI18nOptions('MAX_LENGTH', validationOptions));
}
exports.MaxLength = MaxLength;
function MinLength(min, validationOptions) {
    return classValidator.MinLength(min, mergeI18nOptions('MIN_LENGTH', validationOptions));
}
exports.MinLength = MinLength;
function Matches(pattern, validationOptions) {
    return classValidator.Matches(pattern, mergeI18nOptions('MATCHES', validationOptions));
}
exports.Matches = Matches;
function IsPhoneNumber(region, validationOptions) {
    return classValidator.IsPhoneNumber(region, mergeI18nOptions('IS_PHONE_NUMBER', validationOptions));
}
exports.IsPhoneNumber = IsPhoneNumber;
function IsMilitaryTime(validationOptions) {
    return classValidator.IsMilitaryTime(mergeI18nOptions('IS_MILITARY_TIME', validationOptions));
}
exports.IsMilitaryTime = IsMilitaryTime;
function IsHash(algorithm, validationOptions) {
    return classValidator.IsHash(algorithm, mergeI18nOptions('IS_HASH', validationOptions));
}
exports.IsHash = IsHash;
function IsISSN(validationOptions) {
    return classValidator.IsISSN(mergeI18nOptions('IS_ISSN', validationOptions));
}
exports.IsISSN = IsISSN;
function IsDateString(validationOptions) {
    return classValidator.IsDateString(mergeI18nOptions('IS_DATE_STRING', validationOptions));
}
exports.IsDateString = IsDateString;
function IsBooleanString(validationOptions) {
    return classValidator.IsBooleanString(mergeI18nOptions('IS_BOOLEAN_STRING', validationOptions));
}
exports.IsBooleanString = IsBooleanString;
function IsNumberString(validationOptions) {
    return classValidator.IsNumberString(mergeI18nOptions('IS_NUMBER_STRING', validationOptions));
}
exports.IsNumberString = IsNumberString;
function IsBase32(validationOptions) {
    return classValidator.IsBase32(mergeI18nOptions('IS_BASE32', validationOptions));
}
exports.IsBase32 = IsBase32;
function IsBIC(validationOptions) {
    return classValidator.IsBIC(mergeI18nOptions('IS_BIC', validationOptions));
}
exports.IsBIC = IsBIC;
function IsBtcAddress(validationOptions) {
    return classValidator.IsBtcAddress(mergeI18nOptions('IS_BTC_ADDRESS', validationOptions));
}
exports.IsBtcAddress = IsBtcAddress;
function IsDataURI(validationOptions) {
    return classValidator.IsDataURI(mergeI18nOptions('IS_DATA_URI', validationOptions));
}
exports.IsDataURI = IsDataURI;
function IsEAN(validationOptions) {
    return classValidator.IsEAN(mergeI18nOptions('IS_EAN', validationOptions));
}
exports.IsEAN = IsEAN;
function IsEthereumAddress(validationOptions) {
    return classValidator.IsEthereumAddress(mergeI18nOptions('IS_ETHEREUM_ADDRESS', validationOptions));
}
exports.IsEthereumAddress = IsEthereumAddress;
function IsHSL(validationOptions) {
    return classValidator.IsHSL(mergeI18nOptions('IS_HSL', validationOptions));
}
exports.IsHSL = IsHSL;
function IsIBAN(validationOptions) {
    return classValidator.IsIBAN(mergeI18nOptions('IS_IBAN', validationOptions));
}
exports.IsIBAN = IsIBAN;
function IsIdentityCard(validationOptions) {
    return classValidator.IsIdentityCard(mergeI18nOptions('IS_IDENTITY_CARD', validationOptions));
}
exports.IsIdentityCard = IsIdentityCard;
function IsISRC(validationOptions) {
    return classValidator.IsISRC(mergeI18nOptions('IS_ISRC', validationOptions));
}
exports.IsISRC = IsISRC;
function IsLocale(validationOptions) {
    return classValidator.IsLocale(mergeI18nOptions('IS_LOCALE', validationOptions));
}
exports.IsLocale = IsLocale;
function IsMagnetURI(validationOptions) {
    return classValidator.IsMagnetURI(mergeI18nOptions('IS_MAGNET_URI', validationOptions));
}
exports.IsMagnetURI = IsMagnetURI;
function IsMimeType(validationOptions) {
    return classValidator.IsMimeType(mergeI18nOptions('IS_MIME_TYPE', validationOptions));
}
exports.IsMimeType = IsMimeType;
function IsOctal(validationOptions) {
    return classValidator.IsOctal(mergeI18nOptions('IS_OCTAL', validationOptions));
}
exports.IsOctal = IsOctal;
function IsPassportNumber(countryCode, validationOptions) {
    return classValidator.IsPassportNumber(countryCode, mergeI18nOptions('IS_PASSPORT_NUMBER', validationOptions));
}
exports.IsPassportNumber = IsPassportNumber;
function IsPostalCode(validationOptions) {
    return classValidator.IsPostalCode(mergeI18nOptions('IS_POSTAL_CODE', validationOptions));
}
exports.IsPostalCode = IsPostalCode;
function IsRFC3339(validationOptions) {
    return classValidator.IsRFC3339(mergeI18nOptions('IS_RFC_3339', validationOptions));
}
exports.IsRFC3339 = IsRFC3339;
function IsRgbColor(includePercentValues, validationOptions) {
    return classValidator.IsRgbColor(includePercentValues, mergeI18nOptions('IS_RGB_COLOR', validationOptions));
}
exports.IsRgbColor = IsRgbColor;
function IsSemVer(validationOptions) {
    return classValidator.IsSemVer(mergeI18nOptions('IS_SEM_VER', validationOptions));
}
exports.IsSemVer = IsSemVer;
function IsBoolean(validationOptions) {
    return classValidator.IsBoolean(mergeI18nOptions('IS_BOOLEAN', validationOptions));
}
exports.IsBoolean = IsBoolean;
function IsDate(validationOptions) {
    return classValidator.IsDate(mergeI18nOptions('IS_DATE', validationOptions));
}
exports.IsDate = IsDate;
function IsNumber(options, validationOptions) {
    return classValidator.IsNumber(options, mergeI18nOptions('IS_NUMBER', validationOptions));
}
exports.IsNumber = IsNumber;
function IsEnum(entity, validationOptions) {
    return classValidator.IsEnum(entity, mergeI18nOptions('IS_ENUM', validationOptions));
    return classValidator.IsEnum(mergeI18nOptions('IS_ENUM', validationOptions));
}
exports.IsEnum = IsEnum;
function IsInt(validationOptions) {
    return classValidator.IsInt(mergeI18nOptions('IS_INT', validationOptions));
}
exports.IsInt = IsInt;
function IsString(validationOptions) {
    return classValidator.IsString(mergeI18nOptions('IS_STRING', validationOptions));
}
exports.IsString = IsString;
function IsArray(validationOptions) {
    return classValidator.IsArray(mergeI18nOptions('IS_ARRAY', validationOptions));
}
exports.IsArray = IsArray;
function IsObject(validationOptions) {
    return classValidator.IsObject(mergeI18nOptions('IS_OBJECT', validationOptions));
}
exports.IsObject = IsObject;
function ArrayContains(values, validationOptions) {
    return classValidator.ArrayContains(values, mergeI18nOptions('ARRAY_CONTAINS', validationOptions));
}
exports.ArrayContains = ArrayContains;
function ArrayNotContains(values, validationOptions) {
    return classValidator.ArrayNotContains(values, mergeI18nOptions('ARRAY_NOT_CONTAINS', validationOptions));
}
exports.ArrayNotContains = ArrayNotContains;
function ArrayNotEmpty(validationOptions) {
    return classValidator.ArrayNotEmpty(mergeI18nOptions('ARRAY_NOT_EMPTY', validationOptions));
}
exports.ArrayNotEmpty = ArrayNotEmpty;
function ArrayMinSize(min, validationOptions) {
    return classValidator.ArrayMinSize(min, mergeI18nOptions('ARRAY_MIN_SIZE', validationOptions));
}
exports.ArrayMinSize = ArrayMinSize;
function ArrayMaxSize(max, validationOptions) {
    return classValidator.ArrayMaxSize(max, mergeI18nOptions('ARRAY_MAX_SIZE', validationOptions));
}
exports.ArrayMaxSize = ArrayMaxSize;
function ArrayUnique(validationOptions) {
    return classValidator.ArrayUnique(mergeI18nOptions('ARRAY_UNIQUE', validationOptions));
}
exports.ArrayUnique = ArrayUnique;
function IsNotEmptyObject(options, validationOptions) {
    return classValidator.IsNotEmptyObject(options, mergeI18nOptions('IS_NOT_EMPTY_OBJECT', validationOptions));
}
exports.IsNotEmptyObject = IsNotEmptyObject;
function IsInstance(targetType, validationOptions) {
    return classValidator.IsInstance(targetType, mergeI18nOptions('IS_INSTANCE', validationOptions));
}
exports.IsInstance = IsInstance;
//# sourceMappingURL=index.js.map