import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Module,
  Type,
} from '@nestjs/common';
import { AuditTrailService } from './audit_trail.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AuditTrail,
  AuditTrailSchema,
} from './entities/audit_trail_request.entity';
import { AuditTrailInterceptor } from './audit-trail.interceptor';
import { AuditTrailWriter } from './utils/audit_trail.writer';
import { DataSource } from 'typeorm';
import { MessageService, ResponseService } from '@ait/nestjs-base';
import { AitAuditTrailConfig } from './interfaces/audit_trail_config.interface';

@Global()
@Module({})
export class AitAuditTrailModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuditTrailInterceptor).forRoutes('*');
  }

  static register(config: Partial<AitAuditTrailConfig>): DynamicModule {
    const newConfig = new AitAuditTrailConfig();
    Object.assign(newConfig, config);
    return {
      module: AitAuditTrailModule,
      imports: [
        MongooseModule.forFeature([
          { name: AuditTrail.name, schema: AuditTrailSchema },
        ]),
      ],
      controllers: [],
      providers: [
        AuditTrailService,
        AuditTrailInterceptor,
        {
          provide: AitAuditTrailConfig,
          useValue: newConfig,
        },
      ],
      exports: [AuditTrailService],
    };
  }
}

export class AitAuditTrailWriterModule {
  static forRoot(entities: Type[]): DynamicModule {
    return AitAuditTrailWriterModule.forFeature(entities);
  }

  static forFeature(entities: Type[]): DynamicModule {
    return {
      module: AitAuditTrailWriterModule,
      controllers: [],
      providers: [
        ...entities.map((entity) => ({
          provide: this.getEntityToken(entity),
          useFactory: (
            dataSource: DataSource,
            responseService: ResponseService,
            messageService: MessageService,
          ) =>
            new AuditTrailWriter(
              dataSource,
              responseService,
              messageService,
              entity,
            ),
          inject: [DataSource, ResponseService, MessageService],
        })),
      ],
      exports: [],
    };
  }

  static getEntityToken(type: Type) {
    return `audit_trail.${type.name}`;
  }
}
