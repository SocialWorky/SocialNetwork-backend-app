import { IsEnum, IsString, IsOptional, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { LevelLogEnum } from '../enums/records-logs.enum';

export class CreateRecordsLogDto {
  @IsEnum(LevelLogEnum)
  level: LevelLogEnum;

  @IsString()
  context: string;

  @IsString()
  message: string;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsOptional()
  timestamp?: string;
}

export class CreateManyRecordsLogDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateRecordsLogDto)
  logs: CreateRecordsLogDto[];
}
