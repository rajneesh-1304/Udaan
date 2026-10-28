import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Like } from 'src/domain/like.entity';
import { Post } from 'src/domain/post.entity';
import { Outbox } from 'src/domain/outbox.entity';

@Injectable()
export class LikePostService {
  constructor(private readonly dataSource: DataSource) {}

  async toggleLike(postId: any, data: any) {
    const { userId, userName, userImage } = data;
    if (!postId || !userId) {
      throw new BadRequestException('PostId or UserId not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const likeRepo = this.dataSource.getRepository(Like);
      const postRepo = this.dataSource.getRepository(Post);
      const outboxRepo = this.dataSource.getRepository(Outbox);
      if (!userId) {
        throw new NotFoundException('User is not present');
      }

      const post = await postRepo.findOne({ where: { id: postId.id } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }

      const existingLike = await likeRepo.findOne({
        where: { post: { id: postId.id }, userId: userId },
      });

      if (existingLike) {
        await likeRepo.remove(existingLike);
        return { message: 'Like removed', liked: false };
      }

      const like = likeRepo.create({
        userId: userId,
        post,
      });
      await likeRepo.save(like);
      const outbox = outboxRepo.create({
        message: {
          senderId: userId,
          receiverId: post.userId,
          senderName: userName,
          senderImage: userImage,
          type: 'POSTLIKE',
        },
      });
      await outboxRepo.save(outbox);
      await queryRunner.commitTransaction();

      return { message: 'Post liked', liked: true };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
