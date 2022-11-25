import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';

import { SalType } from '../../constants/role-type';

export type salaryTypeDocument = salaryType & Document;

@Schema()
export class salaryType {
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({ type: String, required: true })
  name: string;

  @IsEnum(SalType)
  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Type',
  })
  @Prop({ enum: SalType, default: SalType.add })
  type: number;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const salaryTypeSchema = SchemaFactory.createForClass(salaryType);
export const salaryTypeJsonSchema = validationMetadatasToSchemas();
