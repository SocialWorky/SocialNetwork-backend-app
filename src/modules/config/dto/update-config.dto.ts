import { IsString, IsOptional } from 'class-validator';

export class UpdateConfigDto {
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  themeColors?: string; // JSON string

  @IsString()
  @IsOptional()
  privacyPolicy?: string;
}
