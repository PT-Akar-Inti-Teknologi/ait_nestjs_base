import { ConfigModule } from '@nestjs/config';
import { DynamicModule, Module } from '@nestjs/common';

import { MessageService } from './service/message.service';
import { ResponseService } from './service/response.service';

/**
 * Required environment:
 * - process.env.PROJECT_NAME
 * - process.env.SERVICE_NAME
 * - process.env.APP_LANGUAGE
 */
@Module({})
export class ResponseModule {
  public static languages: Record<string, any> = {};
  public static selectedLanguage: string;

  public static withLanguages(
    languages: Record<string, any>,
    selectedLanguage?: string,
  ): DynamicModule {
    this.languages = languages;
    this.selectedLanguage = selectedLanguage as any;

    const module: DynamicModule = {
      global: true,
      module: ResponseModule,
      imports: [ConfigModule.forRoot()],
      providers: [MessageService, ResponseService],
    };

    module.exports = module.providers;

    return module;
  }
}
