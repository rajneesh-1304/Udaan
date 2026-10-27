import {
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/domain/auth/auth.entity';
import { AuthRepository } from 'src/infrastructure/repositories/auth.repository';
import { RegisterCommand } from './register.command';
import bcrypt from "bcrypt";
import { OutboxMessageRepository } from 'src/infrastructure/repositories/outbox.repository';
import { UserRegister } from 'src/domain/auth/events/user-registered';

@Injectable()
export class RegisterHandler {
    constructor(
        @InjectRepository(Auth)
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


        return savedUser;
    }
}
