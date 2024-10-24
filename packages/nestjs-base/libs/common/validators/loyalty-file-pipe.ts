import { BadRequestException, HttpStatus, ParseFilePipe } from '@nestjs/common';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { I18nContext } from 'nestjs-i18n';
import { LoyaltyFileValidator } from './file-validator';

export interface LoyaltyFileOptions {
  fieldName: string;
  validators?: LoyaltyFileValidator[];
  errorHttpStatusCode?: ErrorHttpStatusCode;
  /**
   * Defines if file parameter is required.
   * @default true
   */
  fileIsRequired?: boolean;
}

export class LoyaltyFilePipe extends ParseFilePipe {
  constructor({ fieldName, ...options }: LoyaltyFileOptions) {
    super({
      ...options,
      exceptionFactory: (error) => {
        const i18n = I18nContext.current();

        const validator = this.getValidatorById(error);

        const translationKey =
          error == 'File is required' || !validator
            ? 'validation.NOT_EMPTY'
            : validator.buildTranslationKey();

        const validationType = translationKey.split('.')[1];

        const translatedError = validationType
          ? i18n.translate(translationKey, {
              args: {
                property: fieldName,
                constraints: validator?.constraints,
              },
            })
          : error;

        return new BadRequestException({
          response_schema: {
            response_code: `${process.env.PROJECT_NAME}-${
              process.env.SERVICE_NAME ?? 'ADMINS'
            }-${HttpStatus.BAD_REQUEST.toString()}`,
            response_message: 'Bad Request',
          },
          response_output: {
            errors: [
              {
                code: `VALIDATION_${validationType}`,
                field: fieldName,
                message: translatedError,
              },
            ],
          },
        });
      },
    });
  }

  getValidatorById(id: string): LoyaltyFileValidator | undefined {
    return (this.getValidators() as LoyaltyFileValidator[]).find(
      (value) => value.id == id,
    );
  }

  public validate(file: any): Promise<any> {
    return super.validate(file);
  }
}
