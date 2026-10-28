import { Module } from "@nestjs/common";
import { VerifyOtpController } from "./verify-otp.controller";
import { VerifyOtpHandler } from "./verify-otp.handler";
import { OtpStorageService } from "../services/otp-storage.service";
import { AuthRepository } from "src/infrastructure/repository/auth/auth.repository";
import { OutboxMessageRepository } from "src/infrastructure/repository/outbox-message/outbox-message.repository";

@Module({
    controllers: [VerifyOtpController],
    providers: [
        VerifyOtpHandler,
        OtpStorageService,
        AuthRepository,
        OutboxMessageRepository,
    ],
    exports: [VerifyOtpHandler],
})
export class VerifyOtpModule {}
