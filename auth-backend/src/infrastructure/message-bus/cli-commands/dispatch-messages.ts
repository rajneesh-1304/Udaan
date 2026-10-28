
import { Command, CommandRunner, Option } from 'nest-commander';
import { OutboxMessageRelay } from 'src/infrastructure/message-bus/outbox-message-relay.service';

interface DispatchMessagesOptions {
  limit: number;
}

@Command({
  name: 'dispatch-messages',
  description: 'Dispatch pending outbox messages',
})
export class DispatchMessages extends CommandRunner {
  constructor(
    private readonly outboxMessageRelay: OutboxMessageRelay,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    options: DispatchMessagesOptions,
  ): Promise<void> {
    await this.outboxMessageRelay.dispatchMessages(options.limit);
    process.exit(0);
  }

  @Option({
    flags: '-l, --limit <limit>',
    description: 'Maximum number of messages to dispatch',
    defaultValue: 10,
  })
  parseLimit(value: string): number {
    return Number(value);;
  }
}
