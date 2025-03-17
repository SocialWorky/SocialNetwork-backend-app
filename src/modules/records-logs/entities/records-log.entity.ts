import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { LevelLogEnum } from '../enums/records-logs.enum';

@Entity('logs')
export class LogEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ type: 'varchar', length: 10 })
  level: LevelLogEnum;

  @Column({ type: 'varchar', length: 255 })
  context: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;
}
