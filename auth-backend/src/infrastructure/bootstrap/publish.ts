import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { OutboxService } from 'src/feature/services/outbox.service';
import { DataSource } from 'typeorm';
import { PublisherService } from '../rabbitMq/publisher';
@Injectable()
export class Publisher {
    constructor(private readonly outbox: OutboxService, private readonly publisher: PublisherService, private dataSource: DataSource) { }

    async publishEvents() {
        
          const messages = await this.outbox.getPendingMsg();
        
          for (const msg of messages) {
            try {
              await this.publisher.publish(msg);
              await this.outbox.markDispatched(msg.id.toString());
        
            } catch (err) {
              console.error("Failed to process message:", msg.id, err);
            }
          }

    }
}