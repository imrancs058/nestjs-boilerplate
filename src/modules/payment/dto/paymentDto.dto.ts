import { IsOptional, IsString } from 'class-validator';

export class PaymentDtoDto {
  @IsString()
  @IsOptional()
  name: string;
}
