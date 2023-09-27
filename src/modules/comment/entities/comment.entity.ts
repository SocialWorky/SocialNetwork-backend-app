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

  @ManyToOne(() => User, (user) => user._id, { eager: true })
  author: User;

  @OneToMany(() => Media, (media) => media.comment)
  media: Media[];

  @ManyToOne(() => Publication, (publication) => publication.comment)
  @JoinColumn({ name: '_idPublication' })
  publication: Publication;

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  reaction: Reaction[];

  // @OneToMany(() => TagUsers, (tagUsers) => tagUsers.comment, {
  //   eager: true,
  // })
  // taggedUsers: TagUsers[];

  // @OneToMany(() => Reaction, (reaction) => reaction._idPublication, {
  //   eager: true,
  // })
  // reactions: Reaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
