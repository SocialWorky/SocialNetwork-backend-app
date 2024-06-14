import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  PrimaryColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Publication } from '../../publications/entities/publications.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { CustomReaction } from '../../customReaction/entities/customReaction.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Reaction {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  _id: string;

  @Column({ default: false })
  isPublications: boolean;

  @Column({ default: false })
  isComment: boolean;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => CustomReaction, (customReaction) => customReaction._id)
  @JoinColumn({ name: 'customReaction_id' })
  customReaction: CustomReaction;

  @ManyToOne(() => Publication, (publication) => publication._id)
  @JoinColumn({ name: '_idPublication' })
  publication: Publication;

  @ManyToOne(() => Comment, (comment) => comment._id)
  @JoinColumn({ name: '_idComment' })
  comment: Comment;
}
