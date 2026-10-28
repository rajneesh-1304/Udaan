import { Module } from "@nestjs/common";
import { SendOtpController } from "./send-otp.controller";
import { SendOtpHandler } from "./send-otp.handler";
import { OtpGeneratorService } from "../services/otp-generator.service";
import { OtpStorageService } from "../services/otp-storage.service";
import { OtpSenderService } from "../services/otp-sender.service";
import { AuthRepository } from "src/infrastructure/repository/auth/auth.repository";
import { MailerModule } from "src/infrastructure/mailer/mailer.module";

@Module({
    imports: [MailerModule],
    controllers: [SendOtpController],
    providers: [
        SendOtpHandler,
        OtpGeneratorService,
        OtpStorageService,
        OtpSenderService,
        AuthRepository,
    ],
    exports: [SendOtpHandler],
})
export class SendOtpModule {}
