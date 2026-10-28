import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "src/domain/auth/auth.entity";
import { AuthRepository } from "src/infrastructure/repository/auth/auth.repository";
import { RegisterController } from "./register.controller";
import { RegisterHandler } from "./register.service";
import { OutboxMessage } from "src/domain/outbox-message/outbox-message.entity";
import { OutboxMessageRepository } from "src/infrastructure/repository/outbox-message/outbox-message.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Auth, OutboxMessage])],
  controllers: [RegisterController],
  providers: [RegisterHandler, AuthRepository, OutboxMessageRepository],
})

export class RegisterModule { }