import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user/user.entity';
import { RabbitConnection } from 'src/infra/rabbitMq/rabbit.connection';
import { GetProfileController } from './getProfile/getProfile.controller';
import { GetProfileService } from './getProfile/getProfile.service';
import { GetProfilesController } from './getProfiles/getProfiles.controller';
import { GetProfilesService } from './getProfiles/getProfiles.service';
import { UpdateProfileController } from './updateProfile/updateProfile.controller';
import { UpdateProfileService } from './updateProfile/updateProfile.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/jwt.guard';
import { GetProfileBySearchController } from './getProfileBySearch/getProfileBySearch.controller';
import { GetProfileBySearchService } from './getProfileBySearch/getProfileBySearch.service';
import { AddProfileController } from './addProfile/addProfile.controller';
import { AddProfileService } from './addProfile/addProfile.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [
    GetProfileController,
    GetProfilesController,
    UpdateProfileController,
    GetProfileBySearchController,
    AddProfileController,
  ],
  providers: [
    GetProfileService,
    GetProfilesService,
    RabbitConnection,
    UpdateProfileService,
    GetProfileBySearchService,
    AddProfileService,
    JwtAuthGuard,
    JwtService,
  ],
})
export class ProfileModule {}
