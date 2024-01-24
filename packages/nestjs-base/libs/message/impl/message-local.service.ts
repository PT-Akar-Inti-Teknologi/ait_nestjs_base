import { get } from 'lodash';
import { Injectable } from '@nestjs/common';
import { MessageService } from '../message.service';
import { AitMessageConfig, AitMessageConfigLocal } from '../interfaces';
import defaultLanguages from '../message.constant';

@Injectable()
export class MessageLocalService extends MessageService {
  private translations: Record<string, any>;
  constructor(private config: AitMessageConfig) {
    super();
    const configLocal = config as AitMessageConfigLocal;
    this.translations = configLocal.translations ?? defaultLanguages;
  }

  getRaw(key: string): Record<string, string> | string {
    return get(this.translations[this.config.fallbackLanguage], key, {
      message: key,
      code: '',
    });
  }
}
