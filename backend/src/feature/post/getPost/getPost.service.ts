import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { Comment } from 'src/domain/comment.entity';
import { Like } from 'src/domain/like.entity';
import { Post } from 'src/domain/post.entity';
import { Repost } from 'src/domain/repost.entity';
import axios from 'axios';

@Injectable()
export class GetPostService {
  constructor(private readonly dataSource: DataSource) {}

  async getPosts(userId: any) {
    const postRepo = this.dataSource.getRepository(Post);
    const likeRepo = this.dataSource.getRepository(Like);
    const commentRepo = this.dataSource.getRepository(Comment);
    const repostRepo = this.dataSource.getRepository(Repost);

    try {
      const response = await axios.get('http://backend:3001/profile/getAll');
      const users = response.data.user;

      const userMap = new Map();
      users.forEach((u: any) => {
        userMap.set(u.id, u);
      });

      const posts = await postRepo.find();
      const reposts = await repostRepo.find({
        relations: ['post'],
      });

      const postFeed = await Promise.all(
        posts.map(async (post) => {
          const likesCount = await likeRepo.count({
            where: { post: { id: post.id } },
          });

          const comments = await commentRepo.find({
            where: { post: { id: post.id } },
          });

          const nestedComments = await this.buildNestedComments(comments);

          const isLiked = await likeRepo.findOne({
            where: { post: { id: post.id }, userId: userId.id },
          });

          const repostCount = await repostRepo.count({
            where: { post: { id: post.id } },
          });

          const isReposted = await repostRepo.findOne({
            where: { post: { id: post.id }, userId: userId.id },
          });

          return {
            id: post.id,
            type: 'post',
            ...post,
            user: userMap.get(post.userId) || null,
            likesCount,
            commentsCount: nestedComments.length,
            comments: nestedComments,
            repostCount,
            isLiked: !!isLiked,
            isReposted: !!isReposted,
            createdAt: post.createdAt,
          };
        }),
      );

      const postMap = new Map();
      postFeed.forEach((p) => {
        postMap.set(p.id, p);
      });

      const repostFeed = reposts.map((repost) => ({
        type: 'repost',
        id: repost.id,
        userId: repost.userId,
        user: userMap.get(repost.userId) || null,
        repostedBy: repost.repostedBy,

        originalPost: postMap.get(repost.post.id) || null,

        createdAt: repost.createdAt,
      }));

      const feed = [...postFeed, ...repostFeed];

      feed.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      return feed;
    } catch (error) {
      throw error;
    }
  }

  private async buildNestedComments(
    comments: Comment[],
    parentId: string = null,
  ) {
    const filtered = comments.filter((c) => c.parentId === parentId);

    const result = await Promise.all(
      filtered.map(async (comment) => ({
        id: comment.id,
        userId: comment.userId,
        comment: comment.comment,
        createdAt: comment.createAt,
        replies: await this.buildNestedComments(comments, comment.id),
      })),
    );

    return result;
  }
}
