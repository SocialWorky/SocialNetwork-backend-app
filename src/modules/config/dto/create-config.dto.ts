import { IsString, IsNotEmpty } from 'class-validator';

export class CreateConfigDto {
  @IsString()
  @IsNotEmpty()
  logoUrl: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  faviconUrl: string;

  @IsString()
  @IsNotEmpty()
  loginMethods: string; // JSON string

  @IsString()
  @IsNotEmpty()
  themeColors: string; // JSON string

  @IsString()
  @IsNotEmpty()
  privacyPolicy: string;

  @IsString()
  @IsNotEmpty()
  customCss: string;
}
