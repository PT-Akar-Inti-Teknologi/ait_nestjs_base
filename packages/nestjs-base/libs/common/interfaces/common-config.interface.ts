import {
  BrokersFunction,
  ConsumerConfig,
  KafkaConfig,
  ProducerConfig,
} from 'kafkajs';

interface AitCommonConfigBase {
  /** automatically log created_by_id, updated_by_id, deleted_by_id for entities that implements AitBaseEntity, default false */
  autologUser?: boolean;
}

/** config for AIT CommonService */
export type AitCommonConfig = AitCommonConfigHttp | AitCommonConfigKafka;

export class AitCommonConfigHttp implements AitCommonConfigBase {
  broadcastType: 'http';
  autologUser?: boolean;
}

export class AitCommonConfigKafka implements AitCommonConfigBase {
  broadcastType: 'kafka';
  /** kafka config */
  kafka: {
    /** broker host and port */
    brokers: string[] | BrokersFunction;
    /** this service name as client ID identifier and consumer group ID */
    serviceName: string;
    /** kafka config overrides. reference: https://kafka.js.org/docs/configuration */
    config?: KafkaConfig;
    /** kafka producer config overrides. reference: https://kafka.js.org/docs/producing */
    producerConfig?: ProducerConfig;
    /** kafka consumer config overrides. reference: https://kafka.js.org/docs/consuming */
    consumerConfig?: ConsumerConfig;
  };
  autologUser?: boolean;
}
