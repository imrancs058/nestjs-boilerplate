import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
export type CottonSamplingDocument = CottonSampling & Document;

@Schema()
@JSONSchema({
  title: 'CottonSampling',
})
export class CottonSampling {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Supplier',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' })
  supplierId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Sub Category',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  subCategory: Types.ObjectId;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Farm',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Farm_Address' })
  farmId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Sample Mund',
  })
  @Prop({ type: String, required: true })
  mund: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Germination A',
  })
  @Prop({ type: String, required: true })
  germinationA: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Germination B',
  })
  @Prop({ type: String, required: true })
  germinationB: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Cut Method Germination',
  })
  @Prop({ type: String, required: true })
  cutMethodgermination: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Purity Company',
  })
  @Prop({ type: String, required: true })
  purityCompany: string;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'FSC & RD Purity',
  })
  @Prop({ type: Number, required: true })
  rdPurity: number;

  @IsNumber()
  @ApiProperty()
  @IsOptional()
  @JSONSchema({
    title: 'Sample No',
  })
  @Prop({ type: Number, required: false })
  sampleNo: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const CottonSamplingSchema =
  SchemaFactory.createForClass(CottonSampling);
export const cottonSamplingJsonSchema = validationMetadatasToSchemas();
