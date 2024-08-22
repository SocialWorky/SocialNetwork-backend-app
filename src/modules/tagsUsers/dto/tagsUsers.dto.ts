import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  _idPublication: string;

  @ApiProperty()
  @IsString()
  userTagged: string;
}
