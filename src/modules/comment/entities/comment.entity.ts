import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Media } from '../../postMediaFiles/entities/postMediaFiles.entity';
import { Reaction } from '../../reaction/entities/reaction.entity';
import { TagUsers } from '../../tagsUsers/entities/tagUsers.entity';
import { Publication } from 'src/modules/publications/entities/publications.entity';

@Entity()
export class Comment {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  _id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user._id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  author: User;

  @OneToMany(() => Media, (media) => media.comment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  media: Media[];

  @ManyToOne(() => Publication, (publication) => publication.comment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: '_idPublication' })
  publication: Publication;

  @OneToMany(() => Reaction, (reaction) => reaction.comment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reaction: Reaction[];

  @OneToMany(() => TagUsers, (tagUsers) => tagUsers.comment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  taggedUsers: TagUsers[];

  @ManyToOne(() => Media, (media) => media.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: '_idMedia' })
  mediaComment: Media;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;
}
