import { Injectable } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';

@Injectable()
export class PublisherService {
  constructor(private readonly rabbit: RabbitConnection) {}

  async publish(message: any) {
    const channel = await this.rabbit.connect(process.env.RABBITMQ_URL);
    await channel.assertExchange('post.fanout', 'fanout', { durable: true });
    const postQueue = await channel.assertQueue('post.queue', { durable: true });
    await channel.bindQueue(postQueue.queue, 'post.fanout', 'fanout');
    channel.publish(
      'post.fanout',
      'fanout',
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );
  }
}