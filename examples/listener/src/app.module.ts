import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { HashModule } from './hash/hash.module'
import { EmailModule } from '@ait/nest-notification';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    AitAuthModule,
    AitCommonModule,
    AitDatabaseModule,
    AitMessageModule,
    AitResponseModule,
    AitStorageModule,
} from '@pt-akar-inti-teknologi/nestjs-base';
import {
    AitReplicationDataModule,
    AuthPermissionsService,
    JwtStrategy,
    PermissionDocument,
} from '@pt-akar-inti-teknologi/nestjs-replication-data';
import { AcceptLanguageResolver } from 'nestjs-i18n';
import path from 'path';
import { InternalModule } from './internal/internal.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AitDatabaseModule.register({
      dbSync: process.env.DB_SYNC != 'false',
      dbDropSchema: process.env.DB_DROP_SCHEMA == 'true',
      dbLogging: process.env.DB_LOGGING != 'false',
      dbAutoloadEntities: process.env.DB_AUTOLOAD_ENTITIES != 'false',
      dbEntities: ['dist/**/*.entity.ts', 'dist/**/**/*.entity.ts'],
      dbHost: process.env.DB_HOST,
      dbPort: Number(process.env.DB_PORT),
      dbUsername: process.env.DB_USERNAME,
      dbPassword: process.env.DB_PASSWORD,
      dbName: process.env.DB_NAME,
      dbTablePrefix: 'loyalties_',
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT) || void 0,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        commandTimeout: Number(process.env.REDIS_TIMEOUT) || 50000,
      },
      prefix: process.env.QUEUE_PREFIX_NAME,
    }),
    EmailModule.register({
      transport: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: process.env.EMAIL_FROM,
      },
    }),
    AitMessageModule.register({
      useNestI18n: true,
      fallbackLanguage: process.env.APP_LANGUAGE,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    AitResponseModule.register({
      projectName: process.env.PROJECT_NAME,
      serviceName: process.env.SERVICE_NAME,
    }),
    HttpModule,
    AitCommonModule.register({
      broadcastType: 'kafka',
      kafka: {
        brokers: [process.env.KAFKA_HOST],
        serviceName: process.env.PROJECT_NAME + '_' + process.env.SERVICE_NAME,
      },
    }),
    AitAuthModule.register({
      jwtSecretKey: process.env.AUTH_JWTSECRETKEY,
      jwtExpirationTime: process.env.AUTH_JWTEXPIRATIONTIME,
      refreshJwtExpirationTime: process.env.AUTH_REFRESHJWTEXPIRATIONTIME,
      jwtStrategy: {
        strategy: JwtStrategy,
        imports: [TypeOrmModule.forFeature([PermissionDocument])],
        providers: [AuthPermissionsService],
      },
    }),
    AitReplicationDataModule.register({
      apiPrefix: 'api/v1/internal/loyalties',
    }),
    AitStorageModule.register({
      driver: process.env.STORAGE_DRIVER as any,
      s3Key: process.env.STORAGE_S3_KEY,
      s3Secret: process.env.STORAGE_S3_SECRET,
      s3Bucket: process.env.STORAGE_S3_BUCKET,
      s3Region: process.env.STORAGE_S3_REGION,
      s3RootFolder: process.env.STORAGE_ROOT_FOLDER,
    }),
    InternalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
