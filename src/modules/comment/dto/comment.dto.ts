import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  containsMedia?: boolean;

  @IsString()
  authorId: string;

  @IsString()
  @IsOptional()
  idPublication?: string;

  @IsString()
  @IsOptional()
  idMedia?: string;
}
