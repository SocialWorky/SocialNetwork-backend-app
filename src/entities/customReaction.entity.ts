import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class CustomReaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Nombre de la reacción personalizada, por ejemplo: "Me encanta"

  @Column()
  emoji: string; // Emoji que representa la reacción personalizada
}
