import { Module } from "@nestjs/common";
import { DispatchMessages } from "../../cli-commands/dispatch-messages";
import { ProducerService } from "./producer.service";
import { OutboxMessageRelay } from "../../outbox-message-relay.service";
import { OutboxMessageRepository } from "src/infrastructure/repository/outbox-message/outbox-message.repository";
import { RabbitMQModule } from "../config/rabbitmq.module";

@Module({
    imports: [RabbitMQModule],
    providers: [ DispatchMessages, ProducerService, OutboxMessageRelay, OutboxMessageRepository ],
})

export class ProducerModule {}