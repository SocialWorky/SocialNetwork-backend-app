import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  authorId: string; // ID del autor del comentario

  @IsString()
  @IsOptional()
  idPublication?: string; // ID de la publicación padre del comentario

  @IsString()
  @IsOptional()
  idMedia?: string; // ID del archivo multimedia del comentario
}
