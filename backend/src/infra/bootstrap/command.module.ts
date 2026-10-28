import { Module } from '@nestjs/common';
import { RabbitConnection } from '../rabbitMq/rabbit.connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from '../../data-source';
import { OutboxModule } from 'src/feature/services/outbox.module';
import { ConsumerCommand } from './command';
import { ConsumerService } from '../rabbitMq/consumer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
    OutboxModule,
  ],
  providers: [ConsumerCommand, ConsumerService, RabbitConnection],
})
export class Command {}
