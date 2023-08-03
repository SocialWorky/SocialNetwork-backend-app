import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @ApiProperty()
  url: string;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  isPublications?: boolean;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  isComment?: boolean;

  @IsString()
  @ApiProperty()
  _idPublication: string;
}
