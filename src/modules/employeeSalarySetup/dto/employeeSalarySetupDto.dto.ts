import { IsNumber } from 'class-validator';

export class employeeSalarySetupDtoDto {
  @IsNumber()
  amount: number;
}
