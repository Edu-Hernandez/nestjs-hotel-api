import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  legalName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  taxId?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  phone?: string;

  @IsString()
  @Length(1, 255)
  addressLine1!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @IsString()
  @Length(1, 128)
  city!: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  postalCode?: string;

  @IsString()
  @Length(2, 2)
  @Matches(/^[A-Za-z]{2}$/)
  country!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  timezone?: string;
}
