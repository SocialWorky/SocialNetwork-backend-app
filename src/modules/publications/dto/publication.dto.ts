import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePublicationDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  privacy: string;

  @IsNotEmpty()
  @IsString()
  authorId: string;
}
