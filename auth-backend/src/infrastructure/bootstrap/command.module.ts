import { Module } from '@nestjs/common';
import { PublishCommand } from './command';
import { RabbitConnection } from '../rabbitMq/rabbit.connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from '../../data-source';
import { OutboxModule } from 'src/feature/services/outbox.module';
import { OutboxService } from 'src/feature/services/outbox.service';

@Module({
  imports: [TypeOrmModule.forRoot({
    ...AppDataSource.options,
  }), 
  OutboxModule
],
  providers: [PublishCommand, RabbitConnection, OutboxService],
})
export class Command { }
