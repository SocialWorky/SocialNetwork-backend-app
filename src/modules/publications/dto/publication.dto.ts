import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';

enum PrivacyOptions {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends',
}

export class CreatePublicationDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  content?: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(PrivacyOptions)
  privacy: string;

  @IsString()
  @IsOptional()
  extraData?: {
    locations: string;
  };

  @IsBoolean()
  @IsOptional()
  fixed?: boolean;

  @IsString()
  @ApiProperty()
  authorId: string;

  @IsString()
  @IsOptional()
  userReceivingId?: string;

  @IsString()
  @IsOptional()
  mediaId?: string;

  @IsString()
  @IsOptional()
  taggedUsers?: string;

  @IsString()
  @IsOptional()
  reactions?: string;
}

export class UpdatePublicationDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  content?: string;

  @IsEnum(PrivacyOptions)
  @ApiProperty()
  @IsOptional()
  privacy?: string;

  @IsBoolean()
  @IsOptional()
  fixed?: boolean;

  @IsString()
  @IsOptional()
  extraData?: string;
}
