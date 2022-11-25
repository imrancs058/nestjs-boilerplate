import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SaleOfficerDtoDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  lastName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  address: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  area: string;

  @IsString()
  @MinLength(11)
  @IsOptional()
  phone: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
