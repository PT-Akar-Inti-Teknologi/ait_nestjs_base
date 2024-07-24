import { EmailModule } from '@ait/nest-notification';
import { AitAuditTrailModule } from '@ait/nestjs-audit-trail';
import {
  AitCommonModule,
  AitDatabaseModule,
  AitHashModule,
  AitMessageModule,
  AitResponseModule,
  AitStorageModule,
} from '@ait/nestjs-base';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuditTrailModule } from './audit-trail/audit-trail.module';
import { LoginModule } from './login/login.module';
import { MembersModule } from './members/members.module';
import languages from './message/message.constant';
import { UsersModule } from './users/users.module';

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
      dbTablePrefix: 'admins_',
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB_NAME}`,
      {
        user: process.env.MONGODB_USERNAME,
        pass: process.env.MONGODB_PASSWORD,
      },
    ),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
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
    AitCommonModule.register({
      broadcastType: 'kafka',
      kafka: {
        brokers: [process.env.KAFKA_HOST],
        serviceName: process.env.PROJECT_NAME + '_' + process.env.SERVICE_NAME,
      },
      autologUser: true,
    }),
    AitStorageModule.register({
      driver: process.env.STORAGE_DRIVER as any,
      s3Key: process.env.STORAGE_S3_KEY,
      s3Secret: process.env.STORAGE_S3_SECRET,
      s3Bucket: process.env.STORAGE_S3_BUCKET,
      s3Region: process.env.STORAGE_S3_REGION,
      s3RootFolder: process.env.STORAGE_ROOT_FOLDER,
    }),
    AitAuditTrailModule.register({}),
    AuditTrailModule,
    LoginModule,
    UsersModule,
    MembersModule,
    AitMessageModule.register({
      useNestI18n: false,
      fallbackLanguage: process.env.APP_LANGUAGE,
      translations: languages,
    }),
    AitResponseModule.register({
      projectName: process.env.PROJECT_NAME,
      serviceName: process.env.SERVICE_NAME,
    }),
    AitHashModule.register({
      saltLength: Number(process.env.HASH_PASSWORDSALTLENGTH),
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
