import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Publication } from 'src/modules/publications/entities/publications.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
import { TagUsers } from 'src/modules/tagsUsers/entities/tagUsers.entity';
import { Reaction } from 'src/modules/reaction/entities/reaction.entity';

@Entity()
export class User {
  @PrimaryColumn('uuid', { length: 255, generated: 'uuid' })
  _id: string;

  @Column()
  username: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: 'user' })
  rol: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 500, nullable: true })
  token: string;

  @Column({ nullable: true })
  avatar: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Publication, (publication) => publication.author)
  publications: Publication[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => TagUsers, (tagUsers) => tagUsers.user)
  taggedUsers: TagUsers[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];
}
