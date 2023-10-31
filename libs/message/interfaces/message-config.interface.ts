import { Type } from '@nestjs/common';
import { ValidatorOptions } from 'class-validator';
import { I18nLoader } from 'nestjs-i18n';
import {
  Formatter,
  I18nOptionResolver,
  I18nOptions,
} from 'nestjs-i18n/dist/interfaces/i18n-options.interface';

export class AitMessageConfig implements I18nOptions {
  fallbackLanguage: string;
  fallbacks?: { [key: string]: string };
  resolvers?: I18nOptionResolver[];
  loader?: Type<I18nLoader>;
  loaderOptions: any;
  formatter?: Formatter;
  logging?: boolean;
  viewEngine?: 'hbs' | 'pug' | 'ejs';
  disableMiddleware?: boolean;
  skipAsyncHook?: boolean;
  validatorOptions?: ValidatorOptions;
  throwOnMissingKey?: boolean;
  typesOutputPath?: string;

  /// original properties
  /** will use i18n version of MessageService. please fill [translations] if this is false. */
  useNestI18n: boolean;
  /** will be used when not using i18n translations, default to defaultLanguage translations */
  translations?: Record<string, any>;
}
