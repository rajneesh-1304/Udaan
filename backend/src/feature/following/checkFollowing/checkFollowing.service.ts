import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Follow } from 'src/domain/entity/follow.entity';
import { User } from 'src/domain/entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CheckFollowingService {
  constructor(private readonly dataSource: DataSource) {}

  async checkFollowing(otherUserId: string, userId: string) {
    if (!userId || !otherUserId) {
      throw new BadRequestException('User Ids are requested');
    }
    const userRepo = this.dataSource.getRepository(User);
    const followRepo = this.dataSource.getRepository(Follow);

    const [user, otherUser] = await Promise.all([
      userRepo.findOne({ where: { id: userId } }),
      userRepo.findOne({ where: { id: otherUserId } }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!otherUser) {
      throw new NotFoundException('Other user not found');
    }

    const follow = await followRepo.findOne({
      where: [{ user: { id: userId }, follower: { id: otherUserId } }],
    });
    return !!follow;
  }
}
