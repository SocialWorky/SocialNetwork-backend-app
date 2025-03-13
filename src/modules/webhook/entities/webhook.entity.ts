// webhook.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  event: string;

  @Column()
  url: string;

  @Column({ default: true })
  isActive: boolean;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

}
