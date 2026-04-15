import { Type } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateReservationGuestDto {
  @Type(() => Boolean)
  @IsBoolean()
  isPrimary!: boolean;
}
