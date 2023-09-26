import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Publication } from '../../publications/entities/publications.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { CustomReaction } from '../../customReaction/entities/customReaction.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @ManyToOne(() => User, (user) => user.reactions, { eager: true })
  user: User;

  @Column()
  _idPublication: string;

  @ManyToOne(() => CustomReaction, (customReaction) => customReaction._id, {
    eager: true,
  })
  customReaction: CustomReaction;

  @CreateDateColumn()
  createdAt: Date;

  // @ManyToOne(() => Publication, (publication) => publication.reactions)
  // publications: Publication[];

  // @ManyToOne(() => Comment, (comment) => comment.reactions)
  // comment: Comment[];
}
