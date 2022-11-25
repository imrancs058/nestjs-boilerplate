import { IsOptional, IsString } from 'class-validator';

export class labourExpenseDtoDto {
  @IsString()
  @IsOptional()
  assetID: string;

  @IsString()
  @IsOptional()
  typeId: string;

  @IsString()
  @IsOptional()
  contractorRateID: string;
}
