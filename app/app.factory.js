"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.getModuleMetadata = exports.resolveImportProviders = exports.AppFactory = void 0;
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
 * Resolve import with inject providers to imports module
 * @param metadata {ModuleMetadata}
 */
function resolveImportProviders(metadata) {
    const appImports = metadata.imports || [];
    const appProviders = metadata.providers || [];
    appProviders.unshift(config_1.ConfigModule.forRoot().module);
    appImports.forEach((target) => {
        const imports = Reflect.getMetadata('imports', target) || [];
        [...appProviders, ...appImports].forEach((module) => {
            if (module !== target) {
                imports.push(module);
            }
        });
        Reflect.defineMetadata('imports', imports, target);
    });
}
exports.resolveImportProviders = resolveImportProviders;
/**
 * Get list of ModuleMetadata
 * @param Clazz
 */
function getModuleMetadata(Clazz) {
    return ['imports', 'providers', 'controllers', 'exports'].reduce((meta, key) => {
        meta[key] = Reflect.getMetadata(key, Clazz);
        return meta;
    }, {});
}
exports.getModuleMetadata = getModuleMetadata;
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
    const autoCreate = metadata.autoCreate !== false;
    delete metadata.autoCreate;
    return function (Clazz) {
        (0, common_1.Module)(metadata)(Clazz);
        resolveImportProviders(getModuleMetadata(Clazz));
        const result = autoCreate
            ? core_1.NestFactory.create(Clazz).then(async (app) => {
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
            })
            : Promise.resolve();
        if (process.env.JEST_WORKER_ID != undefined) {
            return result;
        }
    };
}
exports.Application = Application;
//# sourceMappingURL=app.factory.js.map