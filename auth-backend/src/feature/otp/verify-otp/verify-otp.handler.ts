import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { OtpStorageService } from "../services/otp-storage.service";
import { VerifyOtpCommand } from "./verify-otp.command";
import { AuthRepository } from "src/infrastructure/repository/auth/auth.repository";
import { OutboxMessageRepository } from "src/infrastructure/repository/outbox-message/outbox-message.repository";
import { UserRegister } from "src/domain/auth/events/user-registered";
import { AuthProvider } from "src/domain/auth/enums/auth_provider.enum";
import { Role } from "src/domain/auth/enums/role.enum";
import { Transactional } from "typeorm-transactional";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class VerifyOtpHandler {
    constructor(
        private readonly otpStorage: OtpStorageService,
        private readonly authRepository: AuthRepository,
        private readonly outboxMessageRepository: OutboxMessageRepository,
    ) { }

    @Transactional()
    async handle(command: VerifyOtpCommand) {
        const { email, otp, type = "register", password, uuid, role } = command;
        const storedOtp = await this.otpStorage.getOtp(email, type);
        if (!storedOtp || storedOtp !== otp) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        await this.otpStorage.removeOtp(email, type);

        const existingUser = await this.authRepository.findAuthDetails(email);
        if (existingUser) {
            throw new ConflictException("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            uuid: uuid || uuidv4(),
            email,
            password: hashedPassword,
            role: role || Role.USER,
            provider: AuthProvider.LOCAL,
        };

        const savedUser = await this.authRepository.saveAuthDetails(userData);
        await this.outboxMessageRepository.storeOutboxMessage(new UserRegister(savedUser));

        const { password: _, ...userResponse } = savedUser;

        return {
            success: true,
            message: "User registered and verified successfully",
            user: userResponse,
        };
    }
}
