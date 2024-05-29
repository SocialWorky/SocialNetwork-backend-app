import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

enum PrivacyOptions {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends',
}

export class CreatePublicationDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(PrivacyOptions)
  privacy: string;

  @IsString()
  @IsOptional()
  extraData?: {
    locations: string;
  };

  @IsString()
  @ApiProperty()
  authorId: string;

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

  @IsString()
  @IsOptional()
  extraData?: string;
}
