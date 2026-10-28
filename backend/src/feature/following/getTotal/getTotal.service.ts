import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Follow } from 'src/domain/entity/follow.entity';
import { User } from 'src/domain/entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class TotalFollowingService {
  constructor(private readonly dataSource: DataSource) {}

  async getTotalFollowing(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is missing');
    }

    const userRepo = this.dataSource.getRepository(User);
    const followRepo = this.dataSource.getRepository(Follow);

    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const total = await followRepo.count({
      where: { follower: { id: userId } },
    });

    return total;
  }
}
