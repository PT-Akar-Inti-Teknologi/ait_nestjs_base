/** config for AIT TypeORM default database root config */
export declare class AitDatabaseConfig {
    /** does database entity need to be synchronized, prefer false on production, default true */
    dbSync?: boolean;
    /** does database entity need to be reset each run, default false */
    dbDropSchema?: boolean;
    /** does database need to be logged in console, default true */
    dbLogging?: boolean;
    /** does entities autoloaded when feature module use TypeOrmModule.forFeature, default to true */
    dbAutoloadEntities?: boolean;
    /** entities to be loaded when autoload_entities is not used */
    dbEntities?: string[];
    /** database host */
    dbHost: string;
    /** database port */
    dbPort: number;
    /** database username */
    dbUsername: string;
    /** database password */
    dbPassword: string;
    /** database name */
    dbName: string;
    /** database table name prefix */
    dbTablePrefix: string;
}
//# sourceMappingURL=database-config.interface.d.ts.map