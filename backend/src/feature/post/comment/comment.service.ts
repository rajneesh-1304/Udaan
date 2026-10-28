import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { Comment } from 'src/domain/comment.entity';
import { Post } from 'src/domain/post.entity';
import { Outbox } from 'src/domain/outbox.entity';

@Injectable()
export class CommentPostService {
  constructor(private readonly dataSource: DataSource) {}

  async addComment(id: any, data: any) {
    const { userId, userName, userImage, parentId, text } = data;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const commentRepo = this.dataSource.getRepository(Comment);
      const postRepo = this.dataSource.getRepository(Post);
      const outboxRepo = this.dataSource.getRepository(Outbox);
      const post = await postRepo.findOne({ where: { id: id } });
      if (!post) {
        throw new NotFoundException('Post not found');
      }
      const wordCount = data.text.trim().split(/\s+/).length;

      if (wordCount > 20) {
        throw new ForbiddenException('Comments cannot be more than 20 words');
      }
      if (!userId) {
        throw new NotFoundException('User id is not present');
      }
      const comment = commentRepo.create({
        userId: userId,
        comment: text,
        post,
        parentId: parentId ?? null,
      });

      const outbox = outboxRepo.create({
        message: {
          senderId: userId,
          receiverId: post.userId,
          senderName: userName,
          senderImage: userImage,
          type: 'POSTCOMMENT',
        },
      });

      await commentRepo.save(comment);
      await outboxRepo.save(outbox);
      await queryRunner.commitTransaction();
      return { message: 'Added Comment' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
