import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Post } from 'src/domain/post.entity';
import { Repost } from 'src/domain/repost.entity';

@Injectable()
export class RepostService {
  constructor(private readonly dataSource: DataSource) {}

  async addRepost(id: any, userId: any, name: any) {
    const postRepo = this.dataSource.getRepository(Post);
    const repostRepo = this.dataSource.getRepository(Repost);
    const post = await postRepo.findOne({ where: { id: id?.id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!userId) {
      throw new NotFoundException('UserId not found');
    }

    const existingRepost = await repostRepo.findOne({
      where: {
        post: { id: id?.id },
        userId: userId,
      },
    });
    if (existingRepost) {
      await repostRepo.remove(existingRepost);
      return { message: 'Reposted removed', reposted: false };
    }

    const repost = repostRepo.create({
      post,
      userId: userId,
      repostedBy: name,
    });
    await repostRepo.save(repost);
    return { message: 'Post reposted successfully', reposted: true };
  }
}
