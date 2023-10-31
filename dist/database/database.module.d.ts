import { DynamicModule } from '@nestjs/common';
import { AitDatabaseConfig } from './interfaces';
export declare class AitDatabaseModule {
    static register({ dbSync, dbDropSchema, dbLogging, dbAutoloadEntities, dbEntities, dbHost, dbPort, dbUsername, dbPassword, dbName, dbTablePrefix, }: AitDatabaseConfig): DynamicModule;
}
//# sourceMappingURL=database.module.d.ts.map