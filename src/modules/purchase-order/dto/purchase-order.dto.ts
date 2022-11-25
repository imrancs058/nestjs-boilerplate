import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
export class PurchaseOrderDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  name: string;
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  direction: string;
}
