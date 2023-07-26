import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Publication } from './publications.entity';
import { User } from './user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @Column()
  content: string;

  @Column('text', { array: true, nullable: true })
  mediaUrls: string[];

  @Column('text', { array: true, nullable: true })
  reactions: string[];

  @ManyToOne(() => User, (user) => user._id)
  author: User;

  @ManyToOne(() => Publication, (publication) => publication._id)
  parentPublication: Publication;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
