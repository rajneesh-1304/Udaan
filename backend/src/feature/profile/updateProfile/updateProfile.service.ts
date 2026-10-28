import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Profile } from 'src/domain/DTO/profile';
import { User } from 'src/domain/entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UpdateProfileService {
  constructor(private readonly dataSource: DataSource) {}

  async updateProfile(id: string, userData: any) {
    const userRepo = this.dataSource.getRepository(User);
    console.log(userData, 'this is update profile data ');
    await userRepo.update(
      { id },
      {
        firstName: userData.firstName,
        lastName: userData.lastName ?? null,
        headline: userData.headline ?? null,
        location: userData.location ?? null,
        profilePicture: userData.image,
        bio: userData.bio ?? null,
        backgroundImage: userData.backgroundImage ?? null,
      },
    );
    return {
      message: 'User updated successfully',
    };
  }
}
