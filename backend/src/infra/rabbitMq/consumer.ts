import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RabbitConnection } from './rabbit.connection';
import { DataSource } from 'typeorm';
import { Inbox } from 'src/domain/entity/inbox.entity';
import { User } from 'src/domain/entity/user.entity';

@Injectable()
export class ConsumerService {
  constructor(
    private readonly rabbit: RabbitConnection,
    private dataSource: DataSource,
  ) {}

  async infoPost() {
    const channel = await this.rabbit.connect(process.env.RABBITMQ_URL);
    const repo = this.dataSource.getRepository(User);
    const inboxRepo = this.dataSource.getRepository(Inbox);
    await channel.assertExchange('post.fanout', 'fanout', {
      durable: true,
    });

    const postQueue = await channel.assertQueue('post.queue', {
      durable: true,
    });
    await channel.bindQueue(postQueue.queue, 'post.fanout', 'fanout');
    const d: any = null;

    channel.consume(postQueue.queue, async (msg) => {
      if (!msg) return;

      const data = JSON.parse(msg.content.toString());
      const isPresent = await inboxRepo.findOne({
        where: { messageId: data.id },
      });
      if (!isPresent) {
        const inbox = inboxRepo.create({
          messageId: data.id,
          handler: 'POST',
        });
        const user = repo.create({
          id: data.message.id,
        });
        await inboxRepo.save(inbox);
        await repo.save(user);
      }

      channel.ack(msg);
    });
  }
}
