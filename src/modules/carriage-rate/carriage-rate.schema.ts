import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, MinLength } from 'class-validator';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type Carriage_RateDocument = Carriage_Rate & Document;

@Schema()
export class Carriage_Rate {
  id: string;

  @MinLength(10)
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'FarmAddressID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  farmAddressId: string;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Rate',
  })
  @Prop({ type: 'number', required: true })
  rate: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}

export const Carriage_RateSchema = SchemaFactory.createForClass(Carriage_Rate);
export const carriage_RateJsonSchema = validationMetadatasToSchemas();
