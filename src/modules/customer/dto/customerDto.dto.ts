import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CustomerDtoDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  area: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
