import { HttpModule } from '@nestjs/axios';
import {
  DynamicModule,
  ForwardReference,
  Global,
  MiddlewareConsumer,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { CommonService } from './common.service';
import { AitRequestContextInterceptor } from './interceptors';
import { AitCommonConfig, AitCommonConfigKafka } from './interfaces';
import { KafkaCommonService } from './services/kafka-common.service';
import { AitAutoLogSubscriber } from './subscribers/auto-log.subscriber';

@Global()
@Module({})
export class AitCommonModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AitRequestContextInterceptor).forRoutes('*');
  }

  static register(config: AitCommonConfig): DynamicModule {
    const imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [HttpModule];
    const providers: Provider[] = [AitRequestContextInterceptor];

    if (config.broadcastType == 'kafka') {
      providers.push({
        provide: AitCommonConfigKafka,
        useValue: config,
      });
      providers.push({
        provide: Kafka,
        useValue: new Kafka({
          ...config.kafka.config,
          brokers: config.kafka.brokers,
          clientId: config.kafka.serviceName,
        }),
      });
      providers.push({
        provide: CommonService,
        useClass: KafkaCommonService,
      });
    } else {
      providers.push(CommonService);
    }

    if (config.autologUser) {
      providers.push(AitAutoLogSubscriber);
    }

    return {
      module: AitCommonModule,
      imports: imports,
      providers: providers,
      exports: [CommonService],
    };
  }
}

/**
 * @deprecated Use AitCommonModule() instead
 */
@Global()
@Module({
  imports: [HttpModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
