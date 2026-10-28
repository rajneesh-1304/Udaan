import { Injectable } from "@nestjs/common";
import { ConfigType } from "./rabbitmq.interface";
import { ConfigService } from '@nestjs/config';
import * as RabbitMQ from 'amqplib';

@Injectable()
export class RabbitMQConfigService {
    private maxReconnectTries = 3;
    private reconnectPolicy = true;

    constructor(
        private readonly configService: ConfigService,
    ) { }

    private config: ConfigType = {
        username: this.configService.get<string>('RABBITMQ_USERNAME'),
        password: this.configService.get<string>('RABBITMQ_PASSWORD'),
        appName: this.configService.get<string>('APP_NAME'),
        heartbeatInterval: this.configService.get<number>(
            'RABBITMQ_HEARTBEAT_INTERVAL',
        ),
        dsn: this.configService.get<string>('RABBITMQ_DSN'),

        primaryQueue: this.configService.get<string>('RABBITMQ_EVENTS_QUEUE'),
        primaryQueueBindingKey: this.configService.get<string>(
            'RABBITMQ_EVENTS_QUEUE_BINDING_KEY',
        ),
        primaryQueueExchange: this.configService.get<string>(
            'RABBITMQ_FANOUT_EXCHANGE',
        ),
        primaryQueueExchangeType: this.configService.get<string>(
            'RABBITMQ_FANOUT_EXCHANGE_TYPE',
        ),
        retryQueue: this.configService.get<string>('RABBITMQ_EVENTS_RETRY_QUEUE'),
        retryQueueBindingKey: this.configService.get<string>(
            'RABBITMQ_EVENTS_RETRY_QUEUE_BINDING_KEY',
        ),
        retryQueueExchange: this.configService.get<string>(
            'RABBITMQ_DIRECT_EXCHANGE',
        ),
        retryQueueExchangeType: this.configService.get<string>(
            'RABBITMQ_DIRECT_EXCHANGE_TYPE',
        ),
        errorQueueRoutingKey: this.configService.get<string>(
            'RABBITMQ_ERROR_QUEUE_ROUTING_KEY',
        ),
        errorQueueExchange: this.configService.get<string>(
            'RABBITMQ_DIRECT_EXCHANGE',
        ),
        errorQueueExchangeType: this.configService.get<string>(
            'RABBITMQ_DIRECT_EXCHANGE_TYPE',
        ),
        delayedRetriesNumber: parseInt(
            this.configService.get<string>('RABBITMQ_DELAYED_RETRIES'),
        ),
        immediateRetriesNumber: parseInt(
            this.configService.get<string>('RABBITMQ_IMMEDIATE_RETRIES'),
        ),
        retryQueueMessageTtl: parseInt(
            this.configService.get<string>('RABBITMQ_RETRY_QUEUE_MESSAGE_TTL'),
        ),
        consumeMessageLimit: parseInt(
            this.configService.get<string>('RABBITMQ_CONSUME_MESSAGE_LIMIT'),
        ),
        dispatchMessageLimit: parseInt(
            this.configService.get<string>('RABBITMQ_DISPATCH_MESSAGE_LIMIT'),
        ),
    }

    async validateConfig() {
        const requiredVariables = [
            'username',
            'password',
            'appName',
            'primaryQueue',
            'primaryQueueBindingKey',
            'primaryQueueExchange',
            'primaryQueueExchangeType',
            'retryQueue',
            'retryQueueBindingKey',
            'retryQueueExchange',
            'retryQueueExchangeType',
            'errorQueueRoutingKey',
            'delayedRetriesNumber',
            'immediateRetriesNumber',
            'retryQueueMessageTtl',
            'dsn',
            'heartbeatInterval',
        ];

        const missingVariables = requiredVariables.filter(
            (key) => this.config[key] === null || this.config[key] === undefined,
        );

        if (missingVariables.length === 0)
            console.log('All prerequisites are met for RabbitMQ.');
        else {
            missingVariables.forEach((variable) => {
                console.log(`Missing required environment variable: ${variable}`);
            });
            process.exit(1);
        }
    }

    getConfig() {
        return this.config;
    }

    getConnectionString() {
        return this.config.dsn;
    }

    getConnectionParams() {
        return {
            credentials: RabbitMQ.credentials.plain(
                this.config.username,
                this.config.password,
            ),
            heartbeat: this.config.heartbeatInterval || 30,
        };
    }

    getMaxReconnectTrialsData() {
        return {
            maxReconnectTries: this.maxReconnectTries,
            reconnectPolicy: this.reconnectPolicy,
        };
    }
}
