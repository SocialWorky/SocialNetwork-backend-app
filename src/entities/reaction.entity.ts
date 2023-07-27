import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Publication } from './publications.entity';
import { Comment } from './comment.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @Column()
  type: string; // Tipo de reacción, por ejemplo: "me gusta", "me divierte", etc.

  @ManyToOne(() => Publication, (publication) => publication.reactions)
  publication: Publication;

  @ManyToOne(() => Comment, (comment) => comment.reactions)
  comment: Comment;
}
