import { IsOptional, IsString } from 'class-validator';

export class CreateMailDto {
  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsString()
  subject: string;

  @IsString()
  title: string;

  @IsString()
  greet: string;

  @IsString()
  message: string;

  @IsString()
  subMessage: string;

  @IsString()
  buttonMessage: string;

  @IsOptional()
  @IsString()
  template?: string;
}
