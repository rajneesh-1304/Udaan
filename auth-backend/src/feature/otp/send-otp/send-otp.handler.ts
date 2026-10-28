import { Injectable, BadRequestException } from "@nestjs/common";
import { SendOtpCommand } from "./send-otp.command";
import { AuthRepository } from "src/infrastructure/repository/auth/auth.repository";
import { OtpGeneratorService } from "../services/otp-generator.service";
import { OtpStorageService } from "../services/otp-storage.service";
import { OtpSenderService } from "../services/otp-sender.service";

@Injectable()
export class SendOtpHandler {
    constructor(
        private readonly repository: AuthRepository,
        private readonly otpGenerator: OtpGeneratorService,
        private readonly otpStorage: OtpStorageService,
        private readonly otpSender: OtpSenderService,
    ) { }

    async handle(command: SendOtpCommand) {
        const { email, type = "register" } = command;

        if (type === "register") {
            const existingUser = await this.repository.findAuthDetails(email);
            if (existingUser) {
                throw new BadRequestException("Email already exists");
            }
        }

        const otp = this.otpGenerator.generate(6);
        await this.otpStorage.saveOtp(email, otp, type, 300);
        await this.otpSender.send(email, otp, type);

        return {
            success: true,
            message: "OTP sent successfully",
            ...(process.env.NODE_ENV !== "production" && { dev_otp: otp }),
        };
    }
}
