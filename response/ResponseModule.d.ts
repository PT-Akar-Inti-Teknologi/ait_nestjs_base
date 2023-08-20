import { DynamicModule } from '@nestjs/common';
export declare class ResponseModule {
    static withLanguages(languages: Record<string, any>, selectedLanguage?: string): DynamicModule;
}
