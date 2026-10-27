import { Command, CommandRunner, Option } from 'nest-commander';
import { Publisher } from './publish';

@Command({ name: 'sayHello', options: { isDefault: true } })
export class PublishCommand extends CommandRunner {

  constructor(
    private readonly publisher: Publisher,
  ) {
    super();
  }


  async run(inputs: string[], options?: Record<string, any>): Promise<void> {
    await this.publisher.publishEvents();
  }
}
