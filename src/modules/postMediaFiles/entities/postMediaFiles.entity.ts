import { Publication } from 'src/modules/publications/entities/publications.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Media {
  @PrimaryColumn('uuid', { length: 255, generated: 'uuid' })
  _id: string;

  @Column()
  url: string;

  @Column({ default: false })
  isPublications: boolean;

  @Column({ default: false })
  isComment: boolean;

  @ManyToOne(() => Publication, (publication) => publication._id)
  @JoinColumn({ name: '_idPublication' })
  publication: Publication;

  @ManyToOne(() => Comment, (comment) => comment._id)
  @JoinColumn({ name: '_idComment' })
  comment: Comment;
}
