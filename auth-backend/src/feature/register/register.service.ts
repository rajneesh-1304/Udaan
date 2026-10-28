import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { AuthRepository } from 'src/infrastructure/repository/auth/auth.repository';
import { RegisterCommand } from './register.command';
import bcrypt from "bcrypt";
import { OutboxMessageRepository } from 'src/infrastructure/repository/outbox-message/outbox-message.repository';
import { UserRegister } from 'src/domain/auth/events/user-registered';
import { Transactional } from 'typeorm-transactional';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RegisterHandler {
    constructor(
        @InjectRepository(AuthRepository)
        private readonly repository: AuthRepository,
        @InjectRepository(OutboxMessageRepository)
        private readonly outboxMessageRepository: OutboxMessageRepository,
    ) { }

    @Transactional()
    async handle(command: RegisterCommand) {
        const { uuid, email, password, role, provider, provider_id } = command.register;

        const existingUser = await this.repository.findAuthDetails(email);
        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        let hashPassword;
        if (password) {
            hashPassword = await bcrypt.hash(password, 10);
        }

        const user = {
            uuid,
            email,
            password: hashPassword,
            role,
            provider,
            provider_id
        };

        const savedUser = await this.repository.saveAuthDetails(user);
        await this.outboxMessageRepository.storeOutboxMessage(new UserRegister(savedUser));
        const { password: _, ...userResponse } = savedUser;
        return userResponse;
    }
}
