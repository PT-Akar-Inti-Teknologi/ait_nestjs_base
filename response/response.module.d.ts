import { DynamicModule } from '@nestjs/common';
/**
 * Required environment:
 * - process.env.PROJECT_NAME
 * - process.env.SERVICE_NAME
 * - process.env.APP_LANGUAGE
 */
export declare class ResponseModule {
    static languages: Record<string, any>;
    static selectedLanguage: string;
    static withLanguages(languages: Record<string, any>, selectedLanguage?: string): DynamicModule;
}
