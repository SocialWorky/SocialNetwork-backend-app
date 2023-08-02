import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Publication } from 'src/modules/publications/entities/publications.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';

@Entity()
export class TagUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @Column()
  _idPublication: string;

  @ManyToOne(() => User, (user) => user.taggedUsers, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  // @ManyToOne(() => Publication, (publication) => publication.taggedUsers)
  // publications: Publication[];

  @ManyToOne(() => Comment, (comment) => comment.taggedUsers)
  comment: Comment[];
}
