import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

enum PrivacyOptions {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS = 'friends',
}

export class CreatePublicationDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(PrivacyOptions)
  privacy: string;

  @IsString()
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
