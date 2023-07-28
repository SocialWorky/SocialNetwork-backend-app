import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Publication } from '../../publications/entities/publications.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { CustomReaction } from '../../customReaction/entities/customReaction.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @Column()
  user: string; // Usuario que reaccionó

  @ManyToOne(() => Publication, (publication) => publication.reactions)
  publication: Publication;

  @ManyToOne(() => Comment, (comment) => comment.reactions)
  comment: Comment;

  @ManyToOne(() => CustomReaction)
  @JoinColumn({ name: 'customReactionId' })
  customReaction: CustomReaction; // Reacción personalizada seleccionada por el usuario

  @CreateDateColumn()
  createdAt: Date;
}
