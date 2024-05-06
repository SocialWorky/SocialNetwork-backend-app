import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateMailDto {
  @ApiProperty({
    description: 'Token to validate email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({
    description: 'Email to send',
    example: 'email@gmail.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    description: 'Password to send',
    example: 'password',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'URL to be sent for the email template',
    example: 'http://localhost:3000',
  })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiProperty({
    description: 'Subject to be sent of the email template',
    example: 'Password Reset',
  })
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Title to be sent of the email template',
    example: 'Password Reset Request',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Greet to be sent of the email template',
    example: 'Hello',
  })
  @IsString()
  greet: string;

  @ApiProperty({
    description: 'Message to be sent of the email template',
    example:
      'You are receiving this email because we received a password reset request for your account.',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'SubMessage to be sent of the email template',
    example:
      'If you did not request a password reset, no further action is required.',
  })
  @IsString()
  subMessage: string;

  @ApiProperty({
    description: 'Button message to be sent of the email template',
    example: 'Reset Password',
  })
  @IsString()
  buttonMessage: string;

  @ApiProperty({
    description: 'Template to be sent of the email template',
    example: 'reset-password',
  })
  @IsOptional()
  @IsString()
  template?: string;
}
