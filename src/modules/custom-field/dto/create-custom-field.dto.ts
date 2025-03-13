import { IsNotEmpty, IsOptional, IsString, IsIn, IsArray, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Choice {
  @IsString()
  value: string;

  @IsString()
  label: string;
}

class Options {
    @IsOptional()
    @IsBoolean()
    multiSelect?: boolean;

    @IsOptional()
    @IsBoolean()
    required?: boolean;

    @IsOptional()
    @IsNumber()
    minLength?: number;

    @IsOptional()
    @IsNumber()
    maxLength?: number;

    @IsOptional()
    @IsString()
    pattern?: string;

    @IsOptional()
    @IsBoolean()
    email?: boolean;

    @IsOptional()
    @IsBoolean()
    visible?: boolean;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Choice)
    choices?: Choice[];

    @IsOptional()
    @IsString()
    placeholder?: string;

    @IsOptional()
    defaultValue?: any;

    @IsOptional()
    @IsNumber()
    min?: number;

    @IsOptional()
    @IsNumber()
    max?: number;

    @IsOptional()
    @IsNumber()
    step?: number;

    @IsOptional()
    @IsNumber()
    rows?: number;

    @IsOptional()
    @IsNumber()
    cols?: number;

    @IsOptional()
    @IsBoolean()
    multiple?: boolean;

    @IsOptional()
    @IsString()
    accept?: string;

    @IsOptional()
    @IsString()
    mask?: string;
}

export class CreateCustomFieldDto {
  @IsNumber()
  index: number;

  @IsString()
  idName: string;

  @IsString()
  type: string;

  @IsString()
  label: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => Options)
  options: Options;

  @IsNotEmpty()
  @IsString()
  @IsIn(['profile', 'register'])
  destination: string;
}

