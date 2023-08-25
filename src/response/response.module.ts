import { DynamicModule, Module } from '@nestjs/common';

import { MessageService } from './service/message.service';
import { ResponseService } from './service/response.service';

@Module({})
export class ResponseModule {
  public static withLanguages(
    languages: Record<string, any>,
    selectedLanguage = 'id',
  ): DynamicModule {
    return {
      global: true,
      module: ResponseModule,
      providers: [
        {
          provide: 'LANGUAGE_OPTIONS',
          useValue: languages,
        },
        {
          provide: 'SELECTED_LANGUAGE',
          useValue: selectedLanguage,
        },
        MessageService,
        ResponseService,
      ],
      exports: [MessageService, ResponseService],
    };
  }
}
