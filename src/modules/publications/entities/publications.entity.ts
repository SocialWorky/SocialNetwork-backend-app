import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Media } from '../../postMediaFiles/entities/postMediaFiles.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Reaction } from '../../reaction/entities/reaction.entity';
import { TagUsers } from '../../tagsUsers/entities/tagUsers.entity';

@Entity()
export class Publication {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  _id: string;

  @Column()
  content: string;

  @Column()
  privacy: string;

  @Column({ default: false })
  fixed: boolean;

  @ManyToOne(() => User, (user) => user._id, { eager: true })
  author: User;

  @ManyToOne(() => User, (user) => user._id, { nullable: true, eager: true })
  userReceiving: User | null;

  @OneToMany(() => Media, (media) => media.publication, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  media: Media[];

  @OneToMany(() => Comment, (comment) => comment.publication, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comment: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.publication, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  reaction: Reaction[];

  @OneToMany(() => TagUsers, (tagUsers) => tagUsers.publication, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  taggedUsers: TagUsers[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;

  @Column('jsonb', { nullable: true })
  extraData: {
    locations: string;
  };
}
