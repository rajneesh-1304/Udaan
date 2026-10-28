import { Injectable } from "@nestjs/common";
import { OutboxMessage } from "src/domain/outbox-message/outbox-message.entity";
import { RabbitMQConnectionService } from "../config/rabbitmq-connection.service";
import { OutboxMessageRepository } from "src/infrastructure/repository/outbox-message/outbox-message.repository";
import { RabbitMQConfigurerService } from "../config/rabbitmq-configurer.service";
import { ConfigType, RabbitMQPublishMessage } from "../config/rabbitmq.interface";

@Injectable()
export class ProducerService {
    private connection: RabbitMQConnectionService;
    constructor(
        private readonly rabbitmqConfigurerService: RabbitMQConfigurerService,
        private readonly rabbitmqConnectionService: RabbitMQConnectionService,
        private readonly outboxMessageRepository: OutboxMessageRepository,
    ) {
        this.connection = this.rabbitmqConnectionService;
    }

    private get config(): ConfigType {
        return this.connection.getConnectionConfiguration();
    }
    
    async handle(messages: OutboxMessage[]) {
        await this.connect();
        const exchanges = [
            { name: this.config.primaryQueueExchange, type: this.config.primaryQueueExchangeType},
            { name: this.config.retryQueueExchange, type: this.config.retryQueueExchangeType },
            { name: this.config.errorQueueExchange, type: this.config.errorQueueExchangeType },
            ...messages
                .map((m) => m.getDestination()?.exchange)
                .filter((name): name is string => Boolean(name))
                .map((name) => ({ name, type: this.config.primaryQueueExchangeType || 'fanout' })),
        ];
        await this.rabbitmqConfigurerService.configureExchanges(exchanges);

        for(const message of messages){
            await this.publisher(message);
        }

        await this.close();
    }
    
    
    private async connect() {
        await this.connection.connect();
    }

    private async close() {
        await this.connection.closeChannel();
    }

    private async publisher(outboxMessage: OutboxMessage) {
        try {
            const message = outboxMessage.getBody();
            const properties = outboxMessage.getProperties();
            const { exchange, routingKey } = outboxMessage.getDestination();

            const messageToPublish : RabbitMQPublishMessage = {
                exchange: exchange,
                routingKey: routingKey,
                content: JSON.stringify(message),
                properties: { ...properties, persistent: true },
            };

            const isPublished = await this.connection.publish(messageToPublish);
            if(!isPublished) throw new Error('Message could not be published.');

            outboxMessage.markAsSent();
            await this.outboxMessageRepository.save(outboxMessage);
        } catch (error) {
            console.log(
                `Error while publishing message ${outboxMessage.type} with id ${outboxMessage.message_id}`,
                error,
            );
        }
    
    }
}