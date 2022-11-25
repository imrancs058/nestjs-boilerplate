import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CottonSamplingDto {
  @IsString()
  supplierId: string;

  @IsString()
  subCategory: string;

  @IsString()
  farmId: string;

  @IsString()
  mund: string;

  @IsString()
  germinationA: string;

  @IsString()
  germinationB: string;

  @IsNumber()
  purity: number;

  @IsNumber()
  rdPurity: number;

  @IsNumber()
  @IsOptional()
  sampleNo: number;
}
