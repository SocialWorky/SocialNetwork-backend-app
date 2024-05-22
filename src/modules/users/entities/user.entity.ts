import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Publication } from '../../publications/entities/publications.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { TagUsers } from '../../tagsUsers/entities/tagUsers.entity';
import { Reaction } from '../../reaction/entities/reaction.entity';
import { Role } from '../../../common/enums/rol.enum';
import { Friendship } from 'src/modules/friends/entities/friend.entity';

@Entity()
export class User {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  _id: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', default: Role.USER, enum: Role })
  role: Role;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ length: 1200, nullable: true })
  token: string;

  @Column({ nullable: true })
  avatar: string;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Publication, (publication) => publication.author)
  publications: Publication[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => TagUsers, (tagUsers) => tagUsers.userTagged)
  userTagged: TagUsers[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @OneToMany(() => Friendship, friendship => friendship.requester)
  sentFriendRequests: Friendship[];

  @OneToMany(() => Friendship, friendship => friendship.receiver)
  receivedFriendRequests: Friendship[];
}
