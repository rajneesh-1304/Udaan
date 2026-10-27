import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "src/domain/auth/auth.entity";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";
import { RegisterController } from "./register.controller";
import { RegisterHandler } from "./register.service";
import { OutboxMessage } from "src/domain/outbox-message/outbox-message.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Auth, OutboxMessage])],
  controllers: [RegisterController, AuthRepository],
  providers: [RegisterHandler],
})

export class RegisterModule {}