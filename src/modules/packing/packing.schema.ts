/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';

import { Document } from 'mongoose';
export type PackingDocument = Packing & Document;
@JSONSchema({
  title: 'Packing',
})
@Schema()
export class Packing {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Packing Size',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PackingSize',
  })
  packingsizeId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Dry',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dry',
  })
  dryId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Sale Store',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'saleStore',
  })
  saleStoreId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Production Output',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productionOutput',
  })
  productionOutputId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Product Item',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productItem',
  })
  productItemId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Supplier',
  })
  @Prop({ type: String, required: true })
  supplier: string;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Shortage Bags',
  })
  @Prop({ type: Number, required: true, default: 0 })
  shortageBags: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Access Bags',
  })
  @Prop({ type: Number, required: true, default: 0 })
  accessBags: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Received Bags',
  })
  @Prop({ type: Number, required: true, default: 0 })
  receivedBags: number;

  // @ApiProperty()
  // @JSONSchema({
  //   title: 'Quantity',
  // })
  // @Prop({ type: Number, required: true })
  // qty: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const PackingSchema = SchemaFactory.createForClass(Packing);
export const packingJsonSchema = validationMetadatasToSchemas();
