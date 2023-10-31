"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AitDatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AitDatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
let AitDatabaseModule = AitDatabaseModule_1 = class AitDatabaseModule {
    static register({ dbSync = true, dbDropSchema = true, dbLogging = true, dbAutoloadEntities = true, dbEntities = [], dbHost, dbPort, dbUsername, dbPassword, dbName, dbTablePrefix, }) {
        return {
            module: AitDatabaseModule_1,
            imports: [
                typeorm_1.TypeOrmModule.forRoot({
                    name: 'default',
                    type: 'postgres',
                    host: dbHost,
                    port: dbPort,
                    entityPrefix: dbTablePrefix,
                    username: dbUsername,
                    password: dbPassword,
                    database: dbName,
                    synchronize: dbSync,
                    dropSchema: dbDropSchema,
                    logging: dbLogging,
                    autoLoadEntities: dbAutoloadEntities,
                    entities: dbEntities,
                    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
                }),
            ],
        };
    }
};
AitDatabaseModule = AitDatabaseModule_1 = __decorate([
    (0, common_1.Module)({})
], AitDatabaseModule);
exports.AitDatabaseModule = AitDatabaseModule;
//# sourceMappingURL=database.module.js.map