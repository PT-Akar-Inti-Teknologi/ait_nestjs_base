import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AitDatabaseConfig } from './interfaces';

@Module({})
export class AitDatabaseModule {
  static register({
    dbSync = true,
    dbDropSchema = true,
    dbLogging = true,
    dbAutoloadEntities = true,
    dbEntities = [],
    dbHost,
    dbPort,
    dbUsername,
    dbPassword,
    dbName,
    dbTablePrefix,
  }: AitDatabaseConfig): DynamicModule {
    return {
      module: AitDatabaseModule,
      imports: [
        TypeOrmModule.forRoot({
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
          namingStrategy: new SnakeNamingStrategy(),
        }),
      ],
    };
  }
}
