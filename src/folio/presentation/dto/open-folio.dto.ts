import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class OpenFolioDto {
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Za-z]{3}$/)
  currency?: string;
}
