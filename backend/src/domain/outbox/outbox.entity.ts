import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OutboxStatus } from './enums/outbox-status.enum';

export * from './enums/outbox-status.enum';
export * from './enums/outbox-type.enum';

@Entity('Outbox')
export class Outbox {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-json')
  message: object;

  @Column({
    type: 'enum',
    enum: OutboxStatus,
    default: OutboxStatus.PENDING,
  })
  status: OutboxStatus;

  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
