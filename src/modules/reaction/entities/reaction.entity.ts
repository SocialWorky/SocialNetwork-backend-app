import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Publication } from '../../publications/entities/publications.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { CustomReaction } from '../../customReaction/entities/customReaction.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Reaction {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  _id: string;

  @ManyToOne(() => User, (user) => user.reactions, { eager: true })
  user: User;

  @Column({ default: false })
  isPublications: boolean;

  @Column({ default: false })
  isComment: boolean;

  @ManyToOne(() => CustomReaction, (customReaction) => customReaction._id, {
    eager: true,
  })
  customReaction: CustomReaction;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Publication, (publication) => publication.reaction)
  @JoinColumn({ name: '_idPublication' })
  publication: Publication;

  @ManyToOne(() => Comment, (comment) => comment.reaction)
  @JoinColumn({ name: '_idComment' })
  comment: Comment;
}
