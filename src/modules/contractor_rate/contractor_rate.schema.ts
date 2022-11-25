import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';

export type Contractor_RateDocument = Contractor_Rate & Document;

@Schema()
export class Contractor_Rate {
  id: string;

  @MinLength(10)
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Contractor ID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  contractorId: string;

  @MinLength(10)
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Farm Address',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  farmAddressId: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Packing Size',
  })
  @Prop({ type: String, required: true })
  packingSize: string;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Rate',
  })
  @Prop({ type: 'number', required: true })
  rate: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Description',
  })
  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}

export const Contractor_RateSchema =
  SchemaFactory.createForClass(Contractor_Rate);
export const contractor_rateJsonSchema = validationMetadatasToSchemas();
