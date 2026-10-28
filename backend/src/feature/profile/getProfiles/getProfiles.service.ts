import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { User } from 'src/domain/entity/user.entity';
import { adminAuth } from 'src/firebaseAdmin';
import { DataSource } from 'typeorm';

@Injectable()
export class GetProfilesService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly dataSource: DataSource,
  ) {}
  async getAll({ page, limit }) {
    const userRepo = this.dataSource.getRepository(User);
    const redisUser = await this.redis.get(`user`);
    const redisTotal = await this.redis.get(`total`);
    if (redisUser && redisTotal) {
      console.log('redis get executed');
      return {
        user: JSON.parse(redisUser),
        total: JSON.parse(redisTotal),
        page,
        limit,
        hasMore: page * limit < JSON.parse(redisTotal),
      };
    }

    const [user, total] = await userRepo
      .createQueryBuilder('user')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    await this.redis.set(`user`, JSON.stringify(user));
    await this.redis.set(`total`, JSON.stringify(total));
    return {
      user: user,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }
}
