import { IsOptional, IsString } from 'class-validator';
import { ReportStatus, ReportType } from '../../../common/enums/status.enum';

export class CreateReportDto {
  @IsString()
  type: ReportType;

  @IsString()
  _idReported: string;

  @IsString()
  reporting_user: string;

  @IsString()
  status: ReportStatus;

  @IsString()
  @IsOptional()
  detail_report?: string;

  @IsString()
  @IsOptional()
  detail_resolution?: string;
}
