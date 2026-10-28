import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { Profile } from 'src/domain/DTO/profile';
import { User } from 'src/domain/entity/user.entity';
import { adminAuth } from 'src/firebaseAdmin';
import { DataSource } from 'typeorm';

@Injectable()
export class AddProfileService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly dataSource: DataSource,
  ) {}

  async addProfile(userData: any) {
    const decodedToken = await adminAuth.verifyIdToken(userData.token);
    const email = decodedToken.email;
    if (!email)
      throw new UnauthorizedException('Invalid token, no email found');

    const userRepo = this.dataSource.getRepository(User);
    const isExist = await userRepo.findOne({ where: { id: userData.id } });
    if (isExist) {
      return { message: 'User Signed in successfully' };
    }

    const user = userRepo.create({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName ?? null,
      headline: userData.headline ?? null,
      location: userData.location ?? null,
      profilePicture: userData.image,
      bio: userData.bio ?? null,
      backgroundImage: userData.backgroundImage,
    });
    await this.redis.del(`user:${userData.id}`);
    await userRepo.save(user);
    return {
      message: 'User created successfully',
      user: {
        id: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
    };
  }
}
