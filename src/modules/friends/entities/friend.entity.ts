import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Status } from 'src/common/enums/status.enum';

@Entity('friends')
export class Friendship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.sentFriendRequests, { eager: true })
  requester: User;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, { eager: true })
  receiver: User;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false, nullable: true })
  isBlocked: boolean;

  @ManyToOne(() => User, { nullable: true })
  blockedBy?: User;
}
