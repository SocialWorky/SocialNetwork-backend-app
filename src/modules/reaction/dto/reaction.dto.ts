import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateReactionDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  // @IsNotEmpty()
  // @IsInt()
  customReaction: number;
}
