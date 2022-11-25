/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class employeeDtoDto {

  @IsString()
  fname: string;

  @IsString()
  lname: string;

  @IsString()
  phone: string;

  @IsNumber()
  salary: number;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  address: string;
}
