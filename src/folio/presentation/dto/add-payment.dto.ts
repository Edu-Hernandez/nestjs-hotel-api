import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { PaymentMethod } from '../../../../generated/prisma/enums';

export class AddPaymentDto {
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsString()
  @Matches(/^\d{1,14}(\.\d{1,2})?$/)
  amount!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  reference?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string | null;
}
