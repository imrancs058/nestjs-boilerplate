import { IsNumber, IsOptional, IsString } from 'class-validator';

export class salaryTypeDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  type: number;
}
