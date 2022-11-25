import { IsNumber, IsOptional, IsString } from 'class-validator';

export class Contractor_RateDto {
  @IsString()
  @IsOptional()
  packingSize: string;

  @IsNumber()
  @IsOptional()
  rate: number;
}
