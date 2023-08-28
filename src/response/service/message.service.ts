import { get } from 'lodash';
import { Injectable } from '@nestjs/common';

import { ResponseModule } from '../response.module';
import { ErrorMessageDTO } from '../dto/response/error-message.dto';

@Injectable()
export class MessageService {
  private static get language() {
    return ResponseModule.languages[
      (ResponseModule.selectedLanguage || process.env.APP_LANGUAGE) as string
    ];
  }

  public get(key: string): string {
    const selectedMessage = get(MessageService.language, key, {
      message: key,
    });

    return get(selectedMessage, 'message', key) as string;
  }

  public getErrorMessage(field: string, key: string): ErrorMessageDTO {
    const selectedMessage = get(MessageService.language, key, {
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
