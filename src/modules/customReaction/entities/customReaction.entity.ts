import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reaction } from '../../reaction/entities/reaction.entity';

@Entity()
export class CustomReaction {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  _id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  emoji: string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Reaction, (reaction) => reaction.customReaction)
  reactions: Reaction[];
}
