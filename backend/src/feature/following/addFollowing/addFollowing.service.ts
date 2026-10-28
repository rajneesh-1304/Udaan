import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Follow } from 'src/domain/entity/follow.entity';
import { User } from 'src/domain/entity/user.entity';
import { Outbox } from 'src/domain/entity/outbox.entity';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class AddFollowingService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly dataSource: DataSource,
  ) {}

  async addFollowing(followerId: string, userId: string) {
    if (!userId || !followerId) {
      throw new BadRequestException('User ID or Follower ID is missing');
    }

    if (userId === followerId) {
      throw new BadRequestException("You can't follow yourself");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userRepo = queryRunner.manager.getRepository(User);
      const followRepo = queryRunner.manager.getRepository(Follow);
      const outboxRepo = queryRunner.manager.getRepository(Outbox);

      const user = await userRepo.findOne({ where: { id: userId } });
      const follower = await userRepo.findOne({ where: { id: followerId } });

      if (!user) throw new NotFoundException('User not found');
      if (!follower) throw new NotFoundException('Follower not found');

      const existingFollow = await followRepo.findOne({
        where: [{ user: { id: userId }, follower: { id: followerId } }],
      });

      if (existingFollow) {
        throw new ConflictException('You are already following this user');
      }

      const follow = followRepo.create({
        user,
        follower,
      });

      const outbox = outboxRepo.create({
        message: {
          senderId: follower.id,
          senderName: follower.firstName,
          senderImage: follower.profilePicture,
          receiverId: user.id,
          type: 'FOLLOW',
          message: `${follower.firstName} started following you`,
        },
      });

      await followRepo.save(follow);
      await outboxRepo.save(outbox);
      await this.redis.del(`user:${followerId}`);
      await userRepo.increment({ id: userId }, 'totalFollowers', 1);

      await queryRunner.commitTransaction();

      return {
        message: `${follower.firstName} started following ${user.firstName}`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
