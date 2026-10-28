import { CommandFactory } from 'nest-commander';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { ProducerModule } from '../rabbitmq/producer/producer.module';

const COMMAND_MODULES = {
    'dispatch-messages': ProducerModule,
}

async function bootstrap(): Promise<void> {
    initializeTransactionalContext();
    const command = process.argv.slice(2)[0];

    await CommandFactory.runWithoutClosing(COMMAND_MODULES[command], [
        'warn',
        'error',
    ]);
}

void bootstrap();