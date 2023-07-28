"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
let App = exports.App = App_1 = class App {
    static providersToProvideImported() {
        const appImports = Reflect.getMetadata('imports', this) || [];
        const appProviders = Reflect.getMetadata('providers', this) || [];
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
    static run(port = 3000) {
        this.providersToProvideImported();
        core_1.NestFactory.create(App_1).then((app) => {
            return app.listen(port, () => this.logger.log(`Running on ${port}`));
        });
    }
};
App.logger = new common_1.Logger('main');
exports.App = App = App_1 = __decorate([
    (0, common_1.Module)({
        providers: [config_1.ConfigModule.forRoot().module],
    })
], App);
//# sourceMappingURL=AppModule.js.map