import { Injectable } from '@nestjs/common';
import { Auth } from 'src/domain/auth/auth.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthPayload } from './auth.interface';

@Injectable()
export class AuthRepository extends Repository<Auth> {
  constructor(dataSource: DataSource) {
    super(Auth, dataSource.createEntityManager());
  }

  async saveAuthDetails(
    payload: AuthPayload,
  ): Promise<Auth> {
    return await this.save(payload);
  }

  async findAuthDetails(
    email: string,
    authProvider?: string,
    provider_id?: string,
  ): Promise<Auth> {
    return this.findOne({
      where: {
        email,
        ...(authProvider && { provider: authProvider }),
        ...(provider_id && { provider_id }),
      },
    });
  }
}
