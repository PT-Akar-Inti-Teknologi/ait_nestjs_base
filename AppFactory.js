"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.AppFactory = void 0;
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
class AppFactory {
    constructor() {
        this.logger = new common_1.Logger('main');
    }
    async setApplicationContext(app) {
        this.app = app;
    }
}
exports.AppFactory = AppFactory;
/**
 * Main application bootstrap
 * Auto load ConfigModule in any imports Metadata
 *
 * @param metadata {ModuleMetadataOptions}
 * @constructor
 */
function Application(metadata) {
    const port = Number(metadata.port || 3000);
    delete metadata.port;
    return function (Clazz) {
        metadata.imports = metadata.imports || [];
        metadata.providers = metadata.providers || [];
        metadata.providers.unshift(config_1.ConfigModule.forRoot().module);
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
        (0, common_1.Module)(metadata)(Clazz);
        const result = core_1.NestFactory.create(Clazz).then(async (app) => {
            const instance = app.get(Clazz);
            if (typeof instance.setApplicationContext === 'function') {
                await instance.setApplicationContext(app);
            }
            await app.listen(port, () => {
                if (instance.hasOwnProperty('logger') &&
                    typeof instance.logger.log === 'function') {
                    instance.logger.log(`Running on ${port}`);
                }
            });
        });
        if (process.env.JEST_WORKER_ID != undefined) {
            return result;
        }
    };
}
exports.Application = Application;
//# sourceMappingURL=AppFactory.js.map