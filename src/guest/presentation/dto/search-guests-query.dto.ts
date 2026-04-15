import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchGuestsQueryDto {
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  documentNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  documentType?: string;
}
