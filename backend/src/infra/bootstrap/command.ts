import { Command, CommandRunner, Option } from 'nest-commander';
import { Publisher } from './publish';
import { ConsumerService } from '../rabbitMq/consumer';

@Command({ name: 'sayHello', options: { isDefault: true } })
export class ConsumerCommand extends CommandRunner {
  constructor(private readonly consumer: ConsumerService) {
    super();
  }

  async run(inputs: string[], options?: Record<string, any>): Promise<void> {
    await this.consumer.infoPost();
  }
}
