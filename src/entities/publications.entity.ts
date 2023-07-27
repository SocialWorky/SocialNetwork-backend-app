import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Media } from './media.entity';
import { Reaction } from './reaction.entity';

@Entity()
export class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @Column()
  content: string;

  @Column()
  privacy: string;

  @Column()
  isComment: boolean;

  @ManyToOne(() => User, (user) => user._id)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.parentPublication)
  comments: Comment[];

  @ManyToMany(() => Media)
  @JoinTable()
  media: Media[];

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  taggedUsers: User[];

  @OneToMany(() => Reaction, (reaction) => reaction.publication)
  reactions: Reaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
