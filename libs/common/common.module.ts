import { HttpModule } from '@nestjs/axios';
import {
  DynamicModule,
  ForwardReference,
  Global,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { AitCommonConfig, AitCommonConfigKafka } from './interfaces';
import { Kafka } from 'kafkajs';
import { KafkaCommonService } from './services/kafka-common.service';

@Global()
@Module({})
export class AitCommonModule {
  static register(config: AitCommonConfig): DynamicModule {
    const imports: Array<
      Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
    > = [HttpModule];
    const providers: Provider[] = [];

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
