import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ nullable: true })
  legend: string;

  @Column({ nullable: true })
  coverImage: string;

  @Column({ nullable: true })
  coverImageMobile: string;

  @Column({ nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  description: string;

  @Column('jsonb', { nullable: true })
  location: {
    city: string;
    region: string;
    country: string;
  };

  @Column('jsonb', { nullable: true })
  socialNetwork: {
    nombre: string;
    link: string;
    type: string;
  };

  @Column({ nullable: true })
  relationshipStatus: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column('jsonb', { nullable: true })
  whatsapp: {
    number: string;
    isViewable: boolean;
  };

  @Column({ nullable: true })
  sex: string;

  @Column({ nullable: true })
  work: string;

  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  university: string;

  @Column('jsonb', { nullable: true })
  hobbies: {
    name: string;
  };

  @Column('jsonb', { nullable: true })
  interests: {
    name: string;
  };

  @Column('jsonb', { nullable: true })
  languages: {
    name: string;
  };

  @OneToOne(() => User, (user) => user._id)
  @JoinColumn({ name: 'user' })
  user: User;
  newProfile: Promise<User>;
}
