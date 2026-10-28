import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginCommand } from './login.command';
import { AuthProvider } from 'src/domain/auth/enums/auth_provider.enum';
import { Role } from 'src/domain/auth/enums/role.enum';
import { AuthRepository } from 'src/infrastructure/repository/auth/auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UserRegister } from 'src/domain/auth/events/user-registered';
import { Transactional } from 'typeorm-transactional';
import { OutboxMessageRepository } from 'src/infrastructure/repository/outbox-message/outbox-message.repository';

@Injectable()
export class LoginHandler {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly repository: AuthRepository,
    @InjectRepository(OutboxMessageRepository)
    private readonly outboxMessageRepository: OutboxMessageRepository,
  ) { }

  @Transactional()
  async handle(command: LoginCommand) {
    const { email, password, provider = AuthProvider.LOCAL, provider_id } = command.login;
    let user = await this.repository.findAuthDetails(email);

    if (provider === AuthProvider.GOOGLE || user?.isGoogleProvider()) {
      if (!user) {
        const newUser = {
          uuid: uuidv4(),
          email,
          role: Role.USER,
          provider: AuthProvider.GOOGLE,
          provider_id,
        };
        user = await this.repository.saveAuthDetails(newUser);
        await this.outboxMessageRepository.storeOutboxMessage(new UserRegister(user));
      }
      return user;
    }

    if (!user) throw new NotFoundException('User not found');

    if (!user.isLocalProvider()) {
      throw new UnauthorizedException('Please sign in with Google');
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) throw new UnauthorizedException('Invalid password');

    return user;
  }
}
