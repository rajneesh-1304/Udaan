import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OutboxMessageRepository } from "../repository/outbox-message/outbox-message.repository";
import { ProducerService } from "./rabbitmq/producer/producer.service";

@Injectable()
export class OutboxMessageRelay {
    constructor(
        private readonly handler: ProducerService,
        @InjectRepository(OutboxMessageRepository)
        private repository: OutboxMessageRepository
    ) {}

    async dispatchMessages(limit: number) {
        try {
            const messages = await this.repository.getUnsentMessages(limit);
            if (!messages.length) {
                console.log('INFO: No messages pending to dispatch.');
                return;
            }

            await this.handler.handle(messages);
            console.log(`INFO: Published ${messages.length} messages.`);
        } catch (error) {
            console.log('Error in publishing messages ', error);
        }
    }
}