import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  @Length(1, 255)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  maxAdults?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  maxChildren?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
