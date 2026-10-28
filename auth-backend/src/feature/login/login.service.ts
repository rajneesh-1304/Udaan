import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginCommand } from './login.command';
import { AuthProvider } from 'src/domain/auth/enums/auth_provider.enum';
import { AuthRepository } from 'src/infrastructure/repository/auth/auth.repository';
import { Auth } from 'src/domain/auth/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LoginHandler {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly repository: AuthRepository
  ) { }

  async handle(command: LoginCommand) {
    const { email, password, provider, provider_id } = command.login;
    let user: Auth;

    if (provider == AuthProvider.LOCAL) {
      user = await this.repository.findAuthDetails(email);
      if (!user) throw new NotFoundException('User not found');

      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) throw new UnauthorizedException('Invalid password');
    }
    else {
      user = await this.repository.findAuthDetails(email, provider, provider_id);
      if (!user) throw new NotFoundException('User not found');
    }

    return user;
  }

}
