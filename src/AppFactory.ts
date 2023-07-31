import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module, INestApplication, Logger } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces/modules/module-metadata.interface';

export class AppFactory {
  protected app: INestApplication;
  protected readonly logger: Logger = new Logger('main');

  protected async setApplicationContext(app: INestApplication) {
    this.app = app;
  }
}

export interface ModuleMetadataOptions extends ModuleMetadata {
  port?: string | number;
}

/**
 * Main application bootstrap
 * Auto load ConfigModule in any imports Metadata
 *
 * @param metadata {ModuleMetadataOptions}
 * @constructor
 */
export function Application(metadata: ModuleMetadataOptions): ClassDecorator {
  const port = Number(metadata.port || 3000);
  delete metadata.port;

  return function (Clazz: any) {
    metadata.imports = metadata.imports || [];
    metadata.providers = metadata.providers || [];

    metadata.providers.unshift(ConfigModule.forRoot().module);

    const dependencies = [
      ...(metadata.providers as any),
      ...(metadata.imports as any),
    ];

    metadata.imports.forEach((targetImport: any) => {
      const imports = Reflect.getMetadata('imports', targetImport) || [];

      dependencies.forEach((module: any) => {
        if (module !== targetImport) {
          imports.push(module);
        }
      });

      Reflect.defineMetadata('imports', imports, targetImport);
    });

    Module(metadata)(Clazz);

    const result: Promise<void> = NestFactory.create(Clazz).then(
      async (app) => {
        const instance = app.get(Clazz);

        if (typeof instance.setApplicationContext === 'function') {
          await instance.setApplicationContext(app);
        }

        await app.listen(port, () => {
          if (
            instance.hasOwnProperty('logger') &&
            typeof instance.logger.log === 'function'
          ) {
            instance.logger.log(`Running on ${port}`);
          }
        });
      },
    );

    if (process.env.JEST_WORKER_ID != undefined) {
      return result as any;
    }
  };
}
