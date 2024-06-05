import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @ApiProperty()
  url: string;

  @IsString()
  @ApiProperty()
  urlThumbnail: string;

  @IsString()
  @ApiProperty()
  urlCompressed: string;

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
