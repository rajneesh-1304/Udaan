import * as RabbitMQ from 'amqplib';
export interface ConfigType {
  username: string;
  password: string;
  appName: string;
  heartbeatInterval: number;
  dsn: string;
  primaryQueueExchange: string;
  primaryQueueExchangeType: string;
  primaryQueue: string;
  primaryQueueBindingKey: string;
  retryQueueExchange: string;
  retryQueueExchangeType: string;
  retryQueue: string;
  retryQueueBindingKey: string;
  errorQueueRoutingKey: string;
  errorQueueExchange: string;
  errorQueueExchangeType: string;
  delayedRetriesNumber: number;
  immediateRetriesNumber: number;
  retryQueueMessageTtl: number;
  consumeMessageLimit: number;
  dispatchMessageLimit: number;
}

export interface RabbitMQPublishMessage {
  exchange: string;
  routingKey: string;
  content: string;
  properties: RabbitMQ.Options.Publish;
}

export interface ExchangeConfig {
  name: string;
  type: string;
}
