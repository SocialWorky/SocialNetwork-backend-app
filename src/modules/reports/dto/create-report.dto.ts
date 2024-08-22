import { IsOptional, IsString } from 'class-validator';
import { ReportStatus, ReportType } from '../../../common/enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty()
  @IsString()
  type: ReportType;

  @ApiProperty()
  @IsString()
  _idReported: string;

  @ApiProperty()
  @IsString()
  reporting_user: string;

  @ApiProperty()
  @IsString()
  status: ReportStatus;

  @ApiProperty()
  @IsString()
  @IsOptional()
  detail_report?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  detail_resolution?: string;
}
