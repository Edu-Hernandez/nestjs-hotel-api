import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CancelReservationDto {
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  cancellationReason?: string | null;
}
