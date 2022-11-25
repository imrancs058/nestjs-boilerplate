import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type salaryGenerateDocument = salaryGenerate & Document;

@Schema()
export class salaryGenerate {
  id: string;

  @Prop({ type: Date, default: Date.now })
  generateDate: Date;

  @Prop({ type: Date, default: Date.now })
  startDate: Date;

  @Prop({ type: Date, default: Date.now })
  endDate: Date;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @ApiProperty()
  @JSONSchema({
    title: 'Generated By',
  })
  @Prop({ type: 'string', required: true, trim: true })
  generatedBy: string;
}
export const salaryGenerateSchema =
  SchemaFactory.createForClass(salaryGenerate);
export const salaryGenerateJsonSchema = validationMetadatasToSchemas();
