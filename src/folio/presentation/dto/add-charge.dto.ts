import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ChargeCategory } from '../../../../generated/prisma/enums';

export class AddChargeDto {
  @IsEnum(ChargeCategory)
  category!: ChargeCategory;

  @IsString()
  @MaxLength(500)
  description!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(9999)
  quantity!: number;

  @IsString()
  @Matches(/^\d{1,12}(\.\d{1,2})?$/)
  unitAmount!: string;

  @IsString()
  @Matches(/^\d{1,14}(\.\d{1,2})?$/)
  totalAmount!: string;

  @IsOptional()
  @IsUUID()
  roomId?: string | null;
}
