import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class TagUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @Column()
  name: string;

  @ManyToMany(() => User, { eager: true }) // Relación ManyToMany con la entidad User para etiquetar usuarios
  @JoinTable()
  taggedUsers: User[];

  @CreateDateColumn()
  createdAt: Date;
}
