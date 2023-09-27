import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsString()
  authorId: string; // ID del autor del comentario

  @IsString()
  idPublication: string; // ID de la publicación padre del comentario
}
