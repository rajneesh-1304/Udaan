import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "src/domain/auth/auth.entity";
import { OutboxMessage } from "src/domain/outbox-message/outbox-message.entity";
import { LoginHandler } from "./login.service";
import { LoginController } from "./login.controller";
import { AuthRepository } from "src/infrastructure/repository/auth/auth.repository";
import { OutboxMessageRepository } from "src/infrastructure/repository/outbox-message/outbox-message.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Auth, OutboxMessage])],
  controllers: [LoginController],
  providers: [LoginHandler, AuthRepository, OutboxMessageRepository],
})

export class LoginModule { }