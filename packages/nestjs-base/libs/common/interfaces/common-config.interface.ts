import {
  BrokersFunction,
  ConsumerConfig,
  KafkaConfig,
  ProducerConfig,
} from 'kafkajs';

/** config for AIT CommonService */
export type AitCommonConfig = AitCommonConfigHttp | AitCommonConfigKafka;

export class AitCommonConfigHttp {
  broadcastType: 'http';
}

export class AitCommonConfigKafka {
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
}
