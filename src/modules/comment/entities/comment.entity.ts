import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Media } from '../../media/entities/media.entity';
import { Reaction } from '../../reaction/entities/reaction.entity';
import { TagUsers } from '../../tagsUsers/entities/tagUsers.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user._id)
  author: User;

  @Column()
  _idPublication: string;

  @OneToMany(() => TagUsers, (tagUsers) => tagUsers.comment, {
    eager: true,
  })
  taggedUsers: TagUsers[];

  @OneToMany(() => Media, (media) => media.publication)
  media: Media[];

  @OneToMany(() => Reaction, (reaction) => reaction._idPublication, {
    eager: true,
  })
  reactions: Reaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
