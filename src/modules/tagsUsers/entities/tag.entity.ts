import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
export class TagUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @Column()
  _idPublication: string;

  @ManyToMany(() => User, { eager: true }) // Relación ManyToMany con la entidad User para etiquetar usuarios
  @JoinTable()
  taggedUsers: User[];

  @CreateDateColumn()
  createdAt: Date;
}
