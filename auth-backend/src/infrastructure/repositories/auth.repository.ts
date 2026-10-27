import { Injectable } from '@nestjs/common';
import { Auth } from 'src/domain/auth/auth.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthRepository extends Repository<Auth> {
  constructor(dataSource: DataSource) {
    super(Auth, dataSource.createEntityManager());
  }

  async saveAuthDetails(
    payload: Auth,
  ): Promise<Auth> {
    return await this.save(payload);
  }

  async findAuthDetails(
    email: string,
    authProvider?: string,
    provider_id?: string
  ): Promise<Auth> {
    return await this.findOne({
      where: {
        email: email,
        provider: authProvider,
        provider_id: provider_id
      },
    });
  }
}
