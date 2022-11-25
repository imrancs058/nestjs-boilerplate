import { IsOptional, IsString } from 'class-validator';

export class SaleStoreDto {
  @IsString()
  @IsOptional()
  direction: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  name: string;
}
