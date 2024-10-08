import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConfigDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  themeColors?: string; // JSON string

  @ApiProperty()
  @IsString()
  @IsOptional()
  privacyPolicy?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  customCss?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  faviconUrl?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  loginMethods?: string; // JSON string
}
