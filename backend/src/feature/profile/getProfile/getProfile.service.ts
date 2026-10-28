import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/domain/entity/user.entity';
import { DataSource } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class GetProfileService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly dataSource: DataSource,
  ) {}

  async getProfile(id: string) {
    if (!id) {
      throw new NotFoundException('Id not provided');
    }
    const cachedUserString = await this.redis.get(`user:${id}`);
    if (cachedUserString) {
      console.log('redis get executed');
      return { user: JSON.parse(cachedUserString) };
    }
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    console.log(user, 'user from db');

    await this.redis.set(`user:${id}`, JSON.stringify(user));
    return { user };
  }
}
