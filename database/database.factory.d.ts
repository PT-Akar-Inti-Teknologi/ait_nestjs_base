import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export declare class DatabaseFactory {
    static build(options: Partial<TypeOrmModuleOptions>): {
        new (): {
            createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions;
        };
    };
}
