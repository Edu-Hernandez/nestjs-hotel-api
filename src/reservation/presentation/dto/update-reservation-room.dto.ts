import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateReservationRoomDto {
  @IsDateString()
  checkInDate!: string;

  @IsDateString()
  checkOutDate!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{1,12}(\.\d{1,2})?$/)
  nightlyRate?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^\d{1,14}(\.\d{1,2})?$/)
  lineTotal?: string | null;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{3}$/)
  lineCurrency?: string | null;
}
