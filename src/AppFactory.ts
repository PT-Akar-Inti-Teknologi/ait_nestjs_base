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
 * Resolve import with inject providers to imports module
 * @param metadata {ModuleMetadata}
 */
export function resolveImportProviders(metadata: ModuleMetadata): void {
  const appImports = metadata.imports || [];

  const appProviders = metadata.providers || [];
  appProviders.unshift(ConfigModule.forRoot().module);

  appImports.forEach((target: any) => {
    const imports = Reflect.getMetadata('imports', target) || [];

    [...appProviders, ...appImports].forEach((module: any) => {
      if (module !== target) {
        imports.push(module);
      }
    });

    Reflect.defineMetadata('imports', imports, target);
  });
}

/**
 * Get list of ModuleMetadata
 * @param Clazz
 */
export function getModuleMetadata(Clazz: any): ModuleMetadata {
  return ['imports', 'providers', 'controllers', 'exports'].reduce(
    (meta: ModuleMetadata, key) => {
      meta[key as keyof ModuleMetadata] = Reflect.getMetadata(key, Clazz);

      return meta;
    },
    {},
  );
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
    Module(metadata)(Clazz);

    resolveImportProviders(getModuleMetadata(Clazz));

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
