import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Reaction } from '../../reaction/entities/reaction.entity';

@Entity()
export class CustomReaction {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  _id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  emoji: string;

  @OneToMany(() => Reaction, (reaction) => reaction.customReaction)
  reactions: Reaction[];
}