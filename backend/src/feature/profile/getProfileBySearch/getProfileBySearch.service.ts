import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/domain/entity/user.entity';
import { DataSource, Like } from 'typeorm';

@Injectable()
export class GetProfileBySearchService {
  constructor(private readonly dataSource: DataSource) {}

  async getProfileBySearch(searchValue: string) {
    if (!searchValue) {
      throw new NotFoundException('Search Value not found');
    }
    const userRepo = this.dataSource.getRepository(User);
    const user = await userRepo.find({
      where: { firstName: Like(`%${searchValue}%`) },
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      user,
    };
  }
}
