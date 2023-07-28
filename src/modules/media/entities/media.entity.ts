import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Publication } from '../../publications/entities/publications.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string; // ID de la imagen o video

  @Column()
  url: string; // URL de la imagen o video

  @ManyToMany(() => Publication, (publication) => publication.media)
  publications: Publication[];

  @ManyToMany(() => Comment, (comment) => comment.media)
  comments: Comment[];
}
