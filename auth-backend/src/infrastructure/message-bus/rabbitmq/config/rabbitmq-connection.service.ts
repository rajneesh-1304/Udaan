import { Injectable } from "@nestjs/common";
import * as RabbitMQ from 'amqplib';
import { EventEmitter } from "stream";
import { RabbitMQConfigService } from "./rabbitmq-config.service";
import { ConfigType, RabbitMQPublishMessage } from "./rabbitmq.interface";

@Injectable()
export class RabbitMQConnectionService {
    public rabbitMqEvents = new EventEmitter();
    private channel: RabbitMQ.Channel;
    private connection: RabbitMQ.Connection;
    private maxReconnectTries = 3;
    private isMaxReconnectPolicyApplied = false;
    private reconnectTries = 0;
    private timeout: NodeJS.Timeout | null;

    constructor(private readonly rabbitMQConfigService: RabbitMQConfigService) {
        const { maxReconnectTries, reconnectPolicy } =
            this.rabbitMQConfigService.getMaxReconnectTrialsData();
        this.rabbitMQConfigService.validateConfig();
        this.maxReconnectTries = reconnectPolicy ? maxReconnectTries || 3 : 0;
        this.isMaxReconnectPolicyApplied = reconnectPolicy;
        this.timeout = null;
    }


    private get config(): ConfigType {
        return this.rabbitMQConfigService.getConfig();
    }

    async connect() {
        try {
            if (this.timeout) clearTimeout(this.timeout);
            this.connection = await this.createConnection();

            this.connection.on('close', this.handleClose.bind(this));
            this.connection.on('error', this.handleError.bind(this));

            console.log("RabbitMQ is connected");

            this.channel = await this.createChannel();

            this.rabbitMqEvents.emit('connected');
            this.reconnectTries = 0;
        } catch (error: any) {
            console.log(
                `Failed to establish connection to RabbitMQ: ${error.message || error}`,
            );
            await this.reconnect();
        }
    }

    getConnectionConfiguration() {
        return this.config;
    }

    async createConnection() {
        const connectionString = this.rabbitMQConfigService.getConnectionString();
        const connectionParams = this.rabbitMQConfigService.getConnectionParams();
        return RabbitMQ.connect(connectionString, connectionParams);
    }

    async createChannel() {
        if (!this.connection) {
            throw new Error('RabbitMQ connection has not been created yet.')
        }
        const channel = await this.connection.createChannel();
        return channel;
    }

    async closeChannel() {
        await this?.channel?.close();
        this.channel = null;
        console.log('Channel closed explicitly.');
    }

    async exchange(exchangeName: string, exchangeType: string) {
        await this.channel?.assertExchange(exchangeName, exchangeType, {
            durable: true,
        });
    }

    async publish(message: RabbitMQPublishMessage) {
        const { exchange, routingKey, content, properties } = message;
        return this.channel?.publish(
            exchange,
            routingKey,
            Buffer.from(content),
            properties,
        );
    }

    getChannel() {
        return this.channel;
    }

    private async handleClose() {
        console.log('Disconnected from RabbitMQ');
        if (this.timeout) clearTimeout(this.timeout);
        await this.reconnect();
    }

    private async handleError(error: Error) {
        console.log('Error in RabbitMQ connection', error);
        if (this.timeout) clearTimeout(this.timeout);
        await this.reconnect();
    }

    private async reconnect() {
        return new Promise<void>((resolve) => {
            this.timeout = setTimeout(async () => {
                console.log('Retries', this.reconnectTries);
                this.reconnectTries++;

                if (this.isMaxReconnectPolicyApplied &&
                    this.reconnectExceeded(this.reconnectTries)
                ) {
                    console.log('Maximum reconnect tries reached, Process exited');
                    process.exit(1);
                }

                console.log(
                    'Reconnecting to RabbitMQ...',
                    'Attempt:',
                    this.reconnectTries,
                    new Date(),
                );
                await this.connect();

                resolve();
            }, 5000);
        });
    }

    private reconnectExceeded(reconnectTries: number) {
        return reconnectTries > this.maxReconnectTries;
    }
}