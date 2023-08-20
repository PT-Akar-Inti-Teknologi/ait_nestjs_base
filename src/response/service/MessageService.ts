import { get } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';

import { ErrorMessageDTO } from '../dto/response/ErrorMessageDTO';

@Injectable()
export class MessageService {
  constructor(
    @Inject('LANGUAGE_OPTIONS') private readonly languages: Record<string, any>,
    @Inject('SELECTED_LANGUAGE') private readonly selectedLanguage: string,
  ) {}

  public get(key: string): string {
    const selectedMessage = get(this.languages[this.selectedLanguage], key, {
      message: key,
    });

    return get(selectedMessage, 'message', key) as string;
  }

  public getErrorMessage(field: string, key: string): ErrorMessageDTO {
    const selectedMessage = get(this.languages[this.selectedLanguage], key, {
      message: key,
      code: '',
    });

    const errorMessageResponse = ErrorMessageDTO.Builder();
    errorMessageResponse.field(field);
    errorMessageResponse.message(selectedMessage['message']);
    errorMessageResponse.code(selectedMessage['code']);

    return errorMessageResponse.build();
  }

  public getRequestErrorsMessage(requestErrors: Record<string, any>[]): string {
    return requestErrors.map((value) => {
      return value.property[0];
    })[0];
  }
}
