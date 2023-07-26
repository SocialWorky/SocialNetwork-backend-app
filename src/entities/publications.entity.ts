import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@Entity()
export class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @Column()
  content: string;

  @Column('text', { array: true, nullable: true })
  mediaUrls: string[];

  @Column()
  privacy: string;

  @Column('text', { array: true, nullable: true })
  reactions: string[];

  @Column()
  isComment: boolean;

  @ManyToOne(() => User, (user) => user._id)
  author: User;

  @OneToMany(() => Comment, (comment) => comment._id)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
