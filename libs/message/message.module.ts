import { Module, Global, DynamicModule } from '@nestjs/common';
import { MessageService } from './message.service';
import { I18nModule } from 'nestjs-i18n';
import { AitMessageConfig } from './interfaces';
import { MessageI18nService } from './impl/message-i18n.service';
import { MessageLocalService } from './impl/message-local.service';

@Global()
@Module({})
export class AitMessageModule {
  static register(config: AitMessageConfig): DynamicModule {
    const { useNestI18n, ...i18nConfig } = config;
    const imports = [];
    if (useNestI18n) {
      imports.push(I18nModule.forRoot(i18nConfig));
    }
    return {
      module: AitMessageModule,
      imports,
      providers: [
        {
          provide: AitMessageConfig,
          useValue: config,
        },
        {
          provide: MessageService,
          useClass: useNestI18n ? MessageI18nService : MessageLocalService,
        },
      ],
      exports: [MessageService],
    };
  }
}
