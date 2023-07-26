import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateUser {
  _id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  isAdmin: boolean;

  isVerified: boolean;

  isActive: boolean;

  token: string;

  @ApiPropertyOptional()
  avatar: string;
}
export class UpdateUser {
  @ApiPropertyOptional()
  username?: string;

  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiPropertyOptional()
  password?: string;

  @ApiPropertyOptional()
  isAdmin?: boolean;

  isVerified?: boolean;

  isActive?: boolean;

  token?: string;

  @ApiPropertyOptional()
  avatar?: string;
}
export class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
