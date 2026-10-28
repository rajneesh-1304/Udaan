import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "src/domain/auth/auth.entity";
import { LoginHandler } from "./login.service";
import { LoginController } from "./login.controller";
import { AuthRepository } from "src/infrastructure/repository/auth/auth.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [LoginController],
  providers: [LoginHandler, AuthRepository],
})

export class LoginModule { }