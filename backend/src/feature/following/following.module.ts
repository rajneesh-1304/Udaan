import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/entity/user.entity';
import { AddFollowController } from './addFollowing/addFollowing.controller';
import { CheckFollowingController } from './checkFollowing/checkFollowing.controller';
import { TotalFollowingController } from './getTotal/getTotal.controller';
import { RemoveFollowController } from './removeFollowing/removeFollowing.controller';
import { AddFollowingService } from './addFollowing/addFollowing.service';
import { CheckFollowingService } from './checkFollowing/checkFollowing.service';
import { TotalFollowingService } from './getTotal/getTotal.service';
import { RemoveFollowService } from './removeFollowing/removeFollowing.service';
import { PublisherService } from 'src/infra/rabbitMq/publisher';
import { RabbitConnection } from 'src/infra/rabbitMq/rabbit.connection';
import { JwtAuthGuard } from 'src/jwt.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [
    AddFollowController,
    CheckFollowingController,
    TotalFollowingController,
    RemoveFollowController,
  ],
  providers: [
    AddFollowingService,
    CheckFollowingService,
    TotalFollowingService,
    RemoveFollowService,
    RabbitConnection,
    PublisherService,
    JwtAuthGuard,
    JwtService,
  ],
})
export class FollowModule {}
