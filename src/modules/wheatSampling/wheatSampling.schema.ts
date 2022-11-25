import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
export type WheatSamplingDocument = WheatSampling & Document;

@Schema()
@JSONSchema({
  title: 'WheatSampling',
})
export class WheatSampling {
  id: string;

  // @MinLength(10)
  // @IsOptional()
  // @ApiProperty()
  // @JSONSchema({
  //   title: 'Purchase Order',
  // })
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' })
  // purchaseOrderId: Types.ObjectId;

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

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Grain weight',
  })
  @Prop({ type: Number, required: true })
  grainWeight: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Barley',
  })
  @Prop({ type: Number, required: true })
  barley: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Oats',
  })
  @Prop({ type: Number, required: true })
  oats: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'FSC & RD Purity',
  })
  @Prop({ type: Number, required: true })
  rdPurity: number;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Purity Company',
  })
  @Prop({ type: String, required: true })
  purityCompnay: string;

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
export const WheatSamplingSchema = SchemaFactory.createForClass(WheatSampling);
export const wheatSamplingJsonSchema = validationMetadatasToSchemas();
