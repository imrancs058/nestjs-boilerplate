import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PackingSizeDtoDto {
  @IsNumber()
  @IsOptional()
  size: number;

  @IsString()
  @IsOptional()
  unit: string;
}
