import {
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  country?: string;
}

class SocialNetworkDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  link?: string;

  @IsString()
  @IsOptional()
  type?: string;
}

class WhatsappDto {
  @IsString()
  @IsOptional()
  number?: string;

  @IsBoolean()
  @IsOptional()
  isViewable?: boolean;
}

class HobbiesDto {
  @IsString()
  @IsOptional()
  name?: string;
}

class InterestsDto {
  @IsString()
  @IsOptional()
  name?: string;
}

class LanguagesDto {
  @IsString()
  @IsOptional()
  name?: string;
}

export class CreateProfileDto {
  @IsString()
  user: string;

  @IsString()
  @IsOptional()
  legend?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  coverImageMobile?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => SocialNetworkDto)
  socialNetwork?: SocialNetworkDto;

  @IsString()
  @IsOptional()
  relationshipStatus?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => WhatsappDto)
  whatsapp?: WhatsappDto;

  @IsString()
  @IsOptional()
  sex?: string;

  @IsString()
  @IsOptional()
  work?: string;

  @IsString()
  @IsOptional()
  school?: string;

  @IsString()
  @IsOptional()
  university?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => HobbiesDto)
  hobbies?: HobbiesDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => InterestsDto)
  interests?: InterestsDto;

  @ValidateNested()
  @IsOptional()
  @Type(() => LanguagesDto)
  languages?: LanguagesDto;
}
