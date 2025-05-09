import { Publication } from 'src/modules/publications/entities/publications.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, OneToMany } from 'typeorm';

@Entity()
export class Media {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  _id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  urlThumbnail: string;

  @Column({ nullable: true })
  urlCompressed: string;

  @Column({ default: false })
  isPublications: boolean;

  @Column({ default: false })
  isComment: boolean;

  @OneToMany(() => Comment, (comments) => comments.mediaComment, { eager: true })
  @JoinColumn({ name: 'comments' })
  comments: Comment[];

  @ManyToOne(() => Publication, (publication) => publication.media, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: '_idPublication' })
  publication: Publication;

  @ManyToOne(() => Comment, (comment) => comment.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: '_idComment' })
  comment: Comment;
}
