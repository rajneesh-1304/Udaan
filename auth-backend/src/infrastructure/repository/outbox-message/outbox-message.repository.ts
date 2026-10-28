import { Injectable } from '@nestjs/common';
import { Event } from 'src/domain/common/event';
import { OutboxMessage } from 'src/domain/outbox-message/outbox-message.entity';
import { DataSource, Repository } from 'typeorm';
import { OutboxMessagePayload } from './outbox-message.interface';
import { MessageDestinationService } from './message-service';
import { OutBoxStatus } from 'src/domain/outbox-message/enums/outbox-status.enum';

@Injectable()
export class OutboxMessageRepository extends Repository<OutboxMessage> {
  constructor(dataSource: DataSource) {
    super(OutboxMessage, dataSource.createEntityManager());
  }

  createOutboxPayloadFromEvent = (
    outbox_message: Event,
  ): OutboxMessagePayload => {

    const messageType = outbox_message.getType();    
    const { exchange, routingKey } = MessageDestinationService.get(messageType);

    return {
      message_id: outbox_message.getId(),
      type: messageType,
      exchange: exchange,
      routing_key: routingKey,
      properties: outbox_message.getProperties(),
      headers: outbox_message.getHeaders(),
      body: outbox_message.getPayload(),
    };
  };

  async storeOutboxMessage(outbox_message: Event ) {
    return await this.save(this.createOutboxPayloadFromEvent(outbox_message));
  }

  async getUnsentMessages(limit: number) {
    const [rows] = await this.findAndCount({
      where: { status: OutBoxStatus.PENDING },
      take: limit,
    });
    return rows;
  }

}
