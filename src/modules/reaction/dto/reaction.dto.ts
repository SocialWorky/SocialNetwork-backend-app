import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateReactionDto {
  @ApiProperty()
  @IsString()
  authorId: string; // ID del autor de la reacción

  @ApiProperty()
  @IsString()
  _idCustomReaction: string;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  isPublications?: boolean;

  @IsBoolean()
  @ApiProperty()
  @IsOptional()
  isComment?: boolean;

  @IsString()
  @ApiProperty()
  _idPublication: string;
}
