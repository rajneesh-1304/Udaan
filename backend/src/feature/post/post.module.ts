import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/domain/user-post/post.entity';
import { Like } from 'src/domain/user-post/like.entity';
import { Comment } from 'src/domain/user-post/comment.entity';
import { Repost } from 'src/domain/user-post/repost.entity';
import { RabbitConnection } from 'src/infra/rabbitMq/rabbit.connection';
import { JwtAuthGuard } from 'src/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { CommentPostController } from './comment/comment.controller';
import { LikePostController } from './like/like.controller';
import { GetPostController } from './getPost/getPost.controller';
import { CreatePostController } from './createPost/createPost.controller';
import { RepostController } from './repost/repost.controller';
import { CommentPostService } from './comment/comment.service';
import { LikePostService } from './like/like.service';
import { GetPostService } from './getPost/getPost.service';
import { CreatePostService } from './createPost/createPost.service';
import { RepostService } from './repost/repost.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Like, Comment, Repost])],
  controllers: [
    CommentPostController,
    LikePostController,
    GetPostController,
    CreatePostController,
    RepostController,
  ],
  providers: [
    CommentPostService,
    LikePostService,
    GetPostService,
    CreatePostService,
    RepostService,
    RabbitConnection,
    JwtAuthGuard,
    JwtService,
  ],
})
export class PostModule {}
