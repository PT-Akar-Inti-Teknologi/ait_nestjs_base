import { Injectable } from '@nestjs/common';
import { ErrorMessageInterface } from '../response/response.interface';

@Injectable()
export class MessageService {
  getRaw(key: string): Record<string, string> | string {
    return {
      message: key,
      code: '',
    };
  }

  get(key: string): string {
    const selectedMessage = this.getRaw(key);

    if (selectedMessage['message']) {
      return selectedMessage['message'];
    }

    return selectedMessage as string;
  }

  getErrorMessage(field: string, key: string): ErrorMessageInterface {
    const selectedMessage = this.getRaw(key);

    if (!selectedMessage['message']) {
      return {
        field,
        message: selectedMessage as string,
        code: '',
      };
    }
    return {
      field,
      message: selectedMessage['message'],
      code: selectedMessage['code'],
    };
  }

  getRequestErrorsMessage(requestErrors: Record<string, any>[]): string {
    const messageErrors: string[] = requestErrors.map((value) => {
      return value.property[0];
    });
    return messageErrors[0];
  }
}
