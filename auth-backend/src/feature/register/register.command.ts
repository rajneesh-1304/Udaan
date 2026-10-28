import { AuthProvider } from 'src/domain/auth/enums/auth_provider.enum';
import { Role } from 'src/domain/auth/enums/role.enum';

export class RegisterCommand {
  constructor(
    public readonly register: {
      uuid: string;
      email: string;
      password?: string;
      provider: AuthProvider;
      role: Role;
      provider_id?: string;
    },
  ) {}
}