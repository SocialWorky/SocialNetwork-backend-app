import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  settings: {
    logoUrl: string;
    title: string;
    themeColors: string;
    privacyPolicy: string;
  };

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
