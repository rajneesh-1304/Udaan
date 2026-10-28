import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Follow } from './follow.entity';
import { Post } from '../user-post/post.entity';
import { Like } from '../user-post/like.entity';
import { Comment } from '../user-post/comment.entity';
import { Repost } from '../user-post/repost.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  headline: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  profilePicture: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  backgroundImage: string;

  @Column({ default: 0 })
  totalFollowers: number;

  @Column({ default: 0 })
  totalFollowing: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @OneToMany(() => Follow, (follow) => follow.user)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Repost, (repost) => repost.user)
  reposts: Repost[];
}
