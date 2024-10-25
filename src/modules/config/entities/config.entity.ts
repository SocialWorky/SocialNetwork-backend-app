import { IsNotEmpty } from 'class-validator/types/decorator/decorators';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb')
  settings: {
    logoUrl: string;
    title: string;
    contactEmail: string;
    faviconUrl: string;
    loginMethods: string;
    themeColors: string;
    privacyPolicy: string;
    urlSite: string;
    description: string;
  };

  @Column('jsonb', {
     default: { logs: { enabled: false, urlApi: '', token: '' } }, nullable: true 
  })
  services: {
    logs: {
      enabled: boolean;
      urlApi: string;
      token: string;
    };
  };

  @Column({ default: '' })
  customCss: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
