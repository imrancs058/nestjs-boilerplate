import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DiscountDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  amount: number;
}
