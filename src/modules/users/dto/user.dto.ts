import { ApiProperty } from '@nestjs/swagger';
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
  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  username: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  name: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(4)
  lastName: string;

  @IsEmail()
  email: string;

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

  @IsString()
  @IsOptional()
  avatar?: string;
}
export class UpdateUser {
  @Transform(({ value }) => value.trim())
  @IsString()
  username?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  name?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  lastName?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  password?: string;

  @IsString()
  role?: Role;

  @IsBoolean()
  isVerified?: boolean;

  @IsBoolean()
  isActive?: boolean;

  @IsString()
  token?: string;

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
