import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRoomBlockDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string | null;
}
