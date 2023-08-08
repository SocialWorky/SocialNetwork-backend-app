import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../../common/enums/rol.enum';
export class CreateUser {
  @ApiProperty()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  name: string;

  @ApiProperty()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  token?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  avatar?: string;
}
export class UpdateUser {
  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional()
  @IsString()
  role?: Role;

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
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password: string;
}
