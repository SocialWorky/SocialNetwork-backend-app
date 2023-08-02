import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reaction } from '../../reaction/entities/reaction.entity';

@Entity()
export class CustomReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  emoji: string;

  @OneToMany(() => Reaction, (reaction) => reaction.customReaction)
  reactions: Reaction[];
}
