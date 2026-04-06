import { IsOptional, IsString, IsUUID, Length, MaxLength } from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  roomTypeId!: string;

  @IsString()
  @Length(1, 32)
  number!: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  floor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
