import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class AssignReservationRoomDto {
  @IsUUID()
  roomId!: string;

  @IsDateString()
  checkInDate!: string;

  @IsDateString()
  checkOutDate!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{1,12}(\.\d{1,2})?$/)
  nightlyRate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{1,14}(\.\d{1,2})?$/)
  lineTotal?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]{3}$/)
  lineCurrency?: string;
}
