import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class StoreDto {
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
