import { Injectable } from '@nestjs/common';
import { Outbox, OutboxStatus } from 'src/domain/outbox/outbox.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class OutboxService {
  constructor(private readonly dataSource: DataSource) {}

  async getPendingMsg() {
    const outboxRepo = this.dataSource.getRepository(Outbox);
    const pendingMsg = await outboxRepo.find({
      where: { status: OutboxStatus.PENDING },
    });
    return pendingMsg;
  }

  async markDispatched(id: any) {
    const outboxRepo = this.dataSource.getRepository(Outbox);
    await outboxRepo.update(id, { status: OutboxStatus.COMPLETED });
  }
}
