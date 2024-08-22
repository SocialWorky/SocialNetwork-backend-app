import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReportStatus, ReportType } from '../../../common/enums/status.enum';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ type: 'enum', enum: ReportType, default: ReportType.POST })
  type: string;

  @Column()
  _idReported: string;

  @Column()
  reporting_user: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: string;

  @Column({ nullable: true })
  detail_report: string;

  @Column({ nullable: true })
  detail_resolution: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
