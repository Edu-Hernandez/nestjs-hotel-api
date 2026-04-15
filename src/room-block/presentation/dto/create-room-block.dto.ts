import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoomBlockDto {
  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string | null;
}
