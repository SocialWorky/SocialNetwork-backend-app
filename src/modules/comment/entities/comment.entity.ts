import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Publication } from '../../publications/entities/publications.entity';
import { User } from '../../users/entities/user.entity';
import { Media } from '../../media/entities/media.entity';
import { Reaction } from '../../reaction/entities/reaction.entity';

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

  @ManyToOne(() => Publication, (publication) => publication._id)
  parentPublication: Publication;

  @ManyToMany(() => Media)
  @JoinTable()
  media: Media[];

  @OneToMany(() => Reaction, (reaction) => reaction.comment)
  reactions: Reaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
