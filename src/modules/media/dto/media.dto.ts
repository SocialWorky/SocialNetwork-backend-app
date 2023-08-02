import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  url: string;

  @IsBoolean()
  @IsOptional()
  isPublications?: boolean;

  @IsBoolean()
  @IsOptional()
  isComment?: boolean;

  @IsString()
  _idPublication: string;
}
