import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Repost } from './repost.entity';
import { User } from '../user/user.entity';
import { PostType } from './enums/post-type.enum';

@Entity('Post')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  text: string;

  @Column('simple-array', { nullable: true })
  image: string[];

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.TEXT,
  })
  type: PostType;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Repost, (repost) => repost.post)
  repost: Repost[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
