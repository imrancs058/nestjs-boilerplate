import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ProductItemDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  name: string;
}
