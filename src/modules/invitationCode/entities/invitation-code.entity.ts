import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class InvitationCode {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  code: string;

  @CreateDateColumn()
  createdAt: Date;
}
