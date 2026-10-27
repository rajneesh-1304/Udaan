import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "src/domain/auth/auth.entity";
import { LoginHandler } from "./login.service";
import { LoginController } from "./login.controller";
import { AuthRepository } from "src/infrastructure/repositories/auth.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [LoginController, AuthRepository],
  providers: [LoginHandler],
})

export class LoginModule {}