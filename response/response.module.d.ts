import { DynamicModule } from '@nestjs/common';
export declare class ResponseModule {
    static languages: Record<string, any>;
    static selectedLanguage: string;
    static withLanguages(languages: Record<string, any>, selectedLanguage?: string): DynamicModule;
}
