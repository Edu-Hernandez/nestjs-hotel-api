import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

export class CreateRateDto {
  @IsUUID()
  roomTypeId!: string;

  @IsDateString()
  validFrom!: string;

  @IsDateString()
  validTo!: string;

  @IsString()
  @Matches(/^\d{1,12}(\.\d{1,2})?$/)
  amount!: string;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Za-z]{3}$/)
  currency?: string;
}
