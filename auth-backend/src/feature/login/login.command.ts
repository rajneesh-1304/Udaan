export class LoginCommand {
  constructor(
    public readonly login: {
      email: string;
      password: string;
      provider: string;
      provider_id: string;
    },
  ) {}
}
