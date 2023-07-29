import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';
export class CreateUser {
  @IsString()
  _id: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @IsBoolean()
  isAdmin: boolean;

  @IsBoolean()
  isVerified: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsString()
  token: string;

  @ApiPropertyOptional()
  @IsString()
  avatar: string;
}
export class UpdateUser {
  @ApiPropertyOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsBoolean()
  isVerified?: boolean;

  @IsBoolean()
  isActive?: boolean;

  @IsString()
  token?: string;

  @ApiPropertyOptional()
  @IsString()
  avatar?: string;
}
export class LoginDto {
  @ApiProperty({
    description: 'Email of the user',
  })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  password: string;
}
