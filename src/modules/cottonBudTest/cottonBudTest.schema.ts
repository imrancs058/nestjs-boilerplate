import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, MinLength } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type CottonBudTestDocument = CottonBudTest & Document;

@Schema()
@JSONSchema({
  title: 'CottonBudTest',
})
export class CottonBudTest {
  id: string;

  @MinLength(10)
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Purchase Order',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' })
  purchaseOrderId: Types.ObjectId;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Field Germination',
  })
  @Prop({ type: Number, required: true })
  fieldGermination: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Before Ginning',
  })
  @Prop({ type: Number, required: true })
  beforeGinning: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'After Ginning',
  })
  @Prop({ type: Number, required: true })
  afterGinning: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Resample 1',
  })
  @Prop({ type: Number, required: true })
  resample1: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Resample 2',
  })
  @Prop({ type: Number, required: true })
  resample2: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Resample 3',
  })
  @Prop({ type: Number, required: true })
  resample3: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Before Dry',
  })
  @Prop({ type: Number, required: true })
  beforeDry: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'After Dry',
  })
  @Prop({ type: Number, required: true })
  afterDry: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'After Pack',
  })
  @Prop({ type: Number, required: true })
  afterPack: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: Boolean, required: true, default: 1 })
  isActive: boolean;
}
export const CottonBudTestSchema = SchemaFactory.createForClass(CottonBudTest);
export const cottonJsonSchema = validationMetadatasToSchemas();
