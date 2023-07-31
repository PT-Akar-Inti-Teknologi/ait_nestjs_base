"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.AppFactory = void 0;
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
let AppFactory = exports.AppFactory = class AppFactory {
    constructor() {
        this.logger = new common_1.Logger('main');
        /*private static providersToProvideImported() {
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
      
        /!**
         * Create AppFactory instance,
         * so class which extend AppFactory can modify INestApplication easily
         * @param port {number | string}
         * @return Promise<AppFactory>
         *!/
        public static async build(port: number | string = 3000): Promise<AppFactory> {
          this.providersToProvideImported();
      
          AppFactory.prototype.app = await NestFactory.create(this);
      
          const instance = new AppFactory();
          await instance.app.listen(port, () =>
            instance.logger.log(`Running on ${port}`),
          );
      
          return instance;
        }*/
    }
    setApplicationContext(app) {
        this.app = app;
    }
};
exports.AppFactory = AppFactory = __decorate([
    (0, common_1.Module)({
        providers: [config_1.ConfigModule.forRoot().module],
    })
], AppFactory);
/**
 * Main application bootstrap
 *
 * @param metadata {ModuleMetadataOptions}
 * @constructor
 */
function Application(metadata = {}) {
    const port = Number(metadata.port || 3000);
    delete metadata.port;
    metadata.imports = metadata.imports || [];
    metadata.providers = metadata.providers || [];
    const dependencies = [
        ...metadata.providers,
        ...metadata.imports,
    ];
    metadata.imports.forEach((targetImport) => {
        const imports = Reflect.getMetadata('imports', targetImport) || [];
        dependencies.forEach((module) => {
            if (module !== targetImport) {
                imports.push(module);
            }
        });
        Reflect.defineMetadata('imports', imports, targetImport);
    });
    return function (Clazz) {
        (0, common_1.Module)(metadata)(Clazz);
        core_1.NestFactory.create(Clazz).then(async (app) => {
            const instance = app.get(Clazz);
            instance.setApplicationContext(app);
            await app.listen(port, () => instance.logger.log(`Running on ${port}`));
        });
    };
}
exports.Application = Application;
//# sourceMappingURL=AppFactory.js.map