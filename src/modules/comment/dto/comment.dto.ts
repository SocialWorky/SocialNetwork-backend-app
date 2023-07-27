import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  authorId: string; // ID del autor del comentario

  @IsNotEmpty()
  parentPublicationId: string; // ID de la publicación padre del comentario
}
