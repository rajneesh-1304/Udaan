import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQConfigService } from './rabbitmq-config.service';
import { RabbitMQConfigurerService } from './rabbitmq-configurer.service';
import { RabbitMQConnectionService } from './rabbitmq-connection.service';
import { TypeOrmModule } from 'src/infrastructure/database/typorm.config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule],
  providers: [
    RabbitMQConfigService,
    RabbitMQConfigurerService,
    RabbitMQConnectionService,
  ],
  exports: [
    RabbitMQConfigService,
    RabbitMQConfigurerService,
    RabbitMQConnectionService,
  ],
})
export class RabbitMQModule {}
