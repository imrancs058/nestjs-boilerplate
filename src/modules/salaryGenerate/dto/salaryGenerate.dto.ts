import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class salaryGenerateDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(10)
  generatedBy: string;
}
