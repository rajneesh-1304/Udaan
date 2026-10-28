import { Injectable } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';

@Injectable()
export class PublisherService {
  constructor(private readonly rabbit: RabbitConnection) {}

  async publish(message: any) {
    const channel = await this.rabbit.connect(process.env.RABBITMQ_URL);
    await channel.assertExchange('notifications.fanout', 'fanout', {
      durable: true,
    });
    channel.publish(
      'notifications.fanout',
      'fanout',
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }
}
