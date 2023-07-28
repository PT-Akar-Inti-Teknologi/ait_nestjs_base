import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module, INestApplication, Logger } from '@nestjs/common';

@Module({
  providers: [ConfigModule.forRoot().module],
})
export class AppFactory {
  private static logger: Logger = new Logger('main');

  private static providersToProvideImported() {
    const appImports = Reflect.getMetadata('imports', this) || [];
    const appProviders = Reflect.getMetadata('providers', this) || [];

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

  public static run(port: number | string = 3000) {
    this.providersToProvideImported();

    NestFactory.create(this).then((app: INestApplication) => {
      return app.listen(port, () => this.logger.log(`Running on ${port}`));
    });
  }
}
