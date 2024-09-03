import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { MessageService } from '../message.service';

@Injectable()
export class MessageI18nService extends MessageService {
  constructor(private i18nService: I18nService) {
    super();
  }

  getRaw(
    key: string,
    args?: Record<string, any>,
  ): Record<string, string> | string {
    return this.i18nService.t(key, { lang: I18nContext.current()?.lang, args });
  }
}
