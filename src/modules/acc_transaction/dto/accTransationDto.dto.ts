import { IsOptional, IsString } from 'class-validator';

export class accTransactionDtoDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  accountName: string;

  @IsString()
  @IsOptional()
  accountNumber: string;

  @IsString()
  @IsOptional()
  branch: string;
}
