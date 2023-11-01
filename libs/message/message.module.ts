import { Module, Global, DynamicModule } from '@nestjs/common';
import { MessageService } from './message.service';
import { I18nModule } from 'nestjs-i18n';
import { AitMessageConfig, AitMessageConfigImpl } from './interfaces';
import { MessageI18nService } from './impl/message-i18n.service';
import { MessageLocalService } from './impl/message-local.service';

@Global()
@Module({})
export class AitMessageModule {
  static register(config: AitMessageConfigImpl): DynamicModule {
    const imports = [];
    if (config.useNestI18n) {
      imports.push(I18nModule.forRoot(config));
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
          useClass: config.useNestI18n
            ? MessageI18nService
            : MessageLocalService,
        },
      ],
      exports: [MessageService],
    };
  }
}
