import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomReactionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  emoji: string;
}
