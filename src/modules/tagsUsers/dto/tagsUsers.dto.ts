import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'Id of the tag',
  })
  @IsString()
  _id: string;

  @ApiProperty({
    description: 'Id of the publication',
  })
  @IsString()
  _idPublication: string;

  @ApiProperty({
    description: 'Users tagged with this tag',
  })
  @IsArray()
  taggedUsers: string[];
}

export class UpdateTagDto {
  @IsString()
  _idPublication: string;

  @IsArray()
  taggedUsers: string[];
}
