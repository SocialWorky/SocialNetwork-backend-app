import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Email {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  _id: string;

  @Column()
  token?: string;

  @Column()
  email?: string;

  @Column()
  password?: string;

  @Column()
  url?: string;

  @Column()
  subject: string;

  @Column()
  title: string;

  @Column()
  greet: string;

  @Column()
  message: string;

  @Column()
  subMessage: string;

  @Column()
  buttonMessage: string;

  @Column()
  template?: string;

  @Column()
  templateLogo?: string;
}
