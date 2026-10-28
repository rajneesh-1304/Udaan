import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { dataSource, dataSourceOptions } from 'src/data-source';

@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        dataSourceOptions(configService),
      inject: [ConfigService],
      async dataSourceFactory() {
        return dataSource;
      },
    }),
  ],
})
export class TypeOrmModule {}
