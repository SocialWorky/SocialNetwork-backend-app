import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Media } from '../../media/entities/media.entity';
import { Reaction } from '../../reaction/entities/reaction.entity';
import { TagUsers } from '../../tagsUsers/entities/tagUsers.entity';

@Entity()
export class Publication {
  @PrimaryColumn('uuid', { length: 255, generated: 'uuid' })
  _id: string;

  @Column()
  content: string;

  @Column()
  privacy: string;

  @ManyToOne(() => User, (user) => user._id, { eager: true })
  author: User;

  @OneToMany(() => Media, (media) => media.publication) // Definir la relación con Media
  media: Media[];

  // @OneToMany(() => TagUsers, (tagUsers) => tagUsers._idPublication, {
  //   eager: true,
  //   nullable: true,
  // })
  // taggedUsers: TagUsers;

  // @OneToMany(() => Reaction, (reaction) => reaction._idPublication, {
  //   eager: true,
  //   nullable: true,
  // })
  // reactions: Reaction;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
