import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './domain/user/user.entity';
import { Follow } from './domain/user/follow.entity';
import { Post } from './domain/user-post/post.entity';
import { Like } from './domain/user-post/like.entity';
import { Comment } from './domain/user-post/comment.entity';
import { Repost } from './domain/user-post/repost.entity';
import { Outbox } from './domain/outbox/outbox.entity';
import { Inbox } from './domain/inbox/inbox.entity';

dotenv.config();

const rawDataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: [User, Follow, Post, Like, Comment, Repost, Outbox, Inbox],
  migrations: ['dist/infra/migrations/*.js'],
  seeds: ['dist/seeds/**/*.js'],
  logging: true,
};

export const dataSourceOptions = rawDataSourceOptions as DataSourceOptions;

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
