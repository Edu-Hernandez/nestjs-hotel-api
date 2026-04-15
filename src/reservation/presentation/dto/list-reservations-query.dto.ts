import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ReservationStatus } from '../../../../generated/prisma/enums';

export class ListReservationsQueryDto {
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsOptional()
  @IsDateString()
  checkInFrom?: string;

  @IsOptional()
  @IsDateString()
  checkInTo?: string;
}
