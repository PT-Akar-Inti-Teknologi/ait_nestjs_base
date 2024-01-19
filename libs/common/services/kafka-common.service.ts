import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  commonEventTopic,
  topicToEntityName,
} from '../utils/common-event-path';
import {
  Admin,
  Consumer,
  EachMessagePayload,
  ITopicConfig,
  Kafka,
  Producer,
} from 'kafkajs';
import { AitCommonConfigKafka } from '../interfaces/common-config.interface';
import { AitCommonBroadcastListener } from '../interfaces';
import { ResponseService } from 'libs/response';
import { CommonService } from '../common.service';

@Injectable()
export class KafkaCommonService
  extends CommonService
  implements OnModuleInit, OnApplicationBootstrap
{
  protected producer: Producer;
  protected consumer: Consumer;
  protected admin: Admin;
  protected eventListeners: Record<string, AitCommonBroadcastListener> = {};

  constructor(
    httpService: HttpService,
    responseService: ResponseService,
    protected kafka: Kafka,
    protected config: AitCommonConfigKafka,
  ) {
    super(httpService, responseService);
    this.consumer = kafka.consumer({
      ...config.kafka.consumerConfig,
      groupId: config.kafka.serviceName,
    });
    this.producer = kafka.producer(config.kafka.producerConfig);
    this.admin = kafka.admin();
  }

  async onApplicationBootstrap() {
    const listeners = Object.keys(this.eventListeners);
    if (listeners.length) {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topics: listeners,
      });
      this.consumer.run({
        eachMessage: (payload) => this.consumeEvent(payload),
      });
    }
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.admin.connect();
  }

  async broadcastUpdate(
    body: Record<string, any>,
    entityName: string,
  ): Promise<void> {
    try {
      Logger.log(
        `Broadcast Update ${entityName} ====`,
        '',
        this.constructor.name,
      );
      console.log(body);

      this.producer.send({
        topic: commonEventTopic(entityName, 'update'),
        messages: [
          {
            value: JSON.stringify(body),
          },
        ],
      });
    } catch (error) {
      Logger.error(error, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  async broadcastDelete(id: string, entityName: string): Promise<void> {
    try {
      Logger.log(
        `Broadcast Delete ${entityName} ====`,
        '',
        this.constructor.name,
      );

      this.producer.send({
        topic: commonEventTopic(entityName, 'delete'),
        messages: [
          {
            value: JSON.stringify({ id }),
          },
        ],
      });
    } catch (error) {
      Logger.error(error, '', this.constructor.name);
      this.responseService.throwError(error);
    }
  }

  listenBroadcasts(
    entityNames: string[],
    action: 'update' | 'delete',
    listener: AitCommonBroadcastListener,
  ): void {
    entityNames.forEach(
      (entity) =>
        (this.eventListeners[commonEventTopic(entity, action)] = listener),
    );
  }

  async consumeEvent(payload: EachMessagePayload): Promise<void> {
    const listener = this.eventListeners[payload.topic];
    if (listener) {
      Logger.log(`PROCESSING KAFKA EVENT: ${payload.topic}`);
      await listener(
        topicToEntityName(payload.topic),
        JSON.parse(payload.message.value.toString()),
      );
    }
  }

  async setupBroadcasts(entityNames: string[], numPartitions = 10) {
    const mappedTopics = [].concat(
      ...entityNames.map((e) => [
        commonEventTopic(e, 'update'),
        commonEventTopic(e, 'delete'),
      ]),
    );
    const createTopics: ITopicConfig[] = [];
    for (const topic of mappedTopics) {
      let count = 0;
      try {
        const meta = await this.admin.fetchTopicMetadata({
          topics: [topic],
        });
        count = meta.topics[0].partitions.length;
      } catch (e) {
        createTopics.push({
          topic,
          numPartitions,
        });
      }
      if (count < numPartitions) {
        this.admin.createPartitions({
          topicPartitions: [
            {
              count: numPartitions,
              topic,
            },
          ],
        });
      }
    }
    this.admin.createTopics({
      topics: createTopics,
    });
  }
}
