import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { Post } from 'src/domain/post.entity';

@Injectable()
export class CreatePostService {
  constructor(private readonly dataSource: DataSource) {}

  async createPost(id: string, data: any) {
    const postRepo = this.dataSource.getRepository(Post);

    const post = postRepo.create({
      text: data.text,
      image: data.images,
      userId: id,
    });

    await postRepo.save(post);

    return { message: 'Post created successfully' };
  }
}
