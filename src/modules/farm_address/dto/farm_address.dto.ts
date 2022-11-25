import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class Farm_AddressDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  tehsil: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  district: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  address: string;
}
