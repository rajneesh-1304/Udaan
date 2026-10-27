import { Module } from "@nestjs/common";
import { LogoutController } from "./logout.controller";

@Module({
  imports: [],
  controllers: [LogoutController],
  providers: [],
})

export class LogoutModule {}