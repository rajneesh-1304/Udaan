import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Inbox')
export class Inbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  messageId: string;

  @Column()
  handler: string;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;
}
