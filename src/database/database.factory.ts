import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

export class DatabaseFactory {
  static build(options: Partial<TypeOrmModuleOptions>) {
    return class Factory implements TypeOrmOptionsFactory {
      createTypeOrmOptions(connectionName?: string): TypeOrmModuleOptions {
        let synchronize = true;
        if (process.env.DB_SYNC) {
          synchronize = process.env.DB_SYNC != 'false';
        }

        let dropSchema = false;
        if (process.env.DB_DROP_SCHEMA) {
          dropSchema = process.env.DB_DROP_SCHEMA == 'true';
        }

        let logging = false;
        if (process.env.DB_LOGGING) {
          logging = process.env.DB_LOGGING == 'true';
        }

        let autoLoadEntities = true;
        if (process.env.DB_AUTOLOAD_ENTITIES) {
          autoLoadEntities = process.env.DB_AUTOLOAD_ENTITIES != 'false';
        }

        return {
          ...options,
          name: connectionName,
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: synchronize,
          dropSchema: dropSchema,
          logging: logging,
          autoLoadEntities: autoLoadEntities,
          entities: ['dist/**/*.entity.ts', 'dist/**/**/*.entity.ts'],
          namingStrategy: new SnakeNamingStrategy(),
        } as TypeOrmModuleOptions;
      }
    };
  }
}
