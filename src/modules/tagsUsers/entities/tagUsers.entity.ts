import {
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Publication } from 'src/modules/publications/entities/publications.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';

@Entity()
export class TagUsers {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  _id: string;

  @ManyToOne(() => User, (user) => user.userTagged, { eager: true })
  userTagged: User;

  @Column()
  _idPublication: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Publication, (publication) => publication.reaction)
  @JoinColumn({ name: '_idPublication' })
  publication: Publication;

  @ManyToOne(() => Comment, (comment) => comment.reaction)
  @JoinColumn({ name: '_idComment' })
  comment: Comment;
}
