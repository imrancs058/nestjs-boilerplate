import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
export type StockDocument = Stock & Document;
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';

@Schema()
@JSONSchema({
  title: 'Stock',
})
export class Stock {
  id: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Sale Store ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SaleStore',
  })
  salestoreId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Product Item ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PackingSize',
  })
  packingSizeId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Product Item ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductItem',
  })
  productItemId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Product Item',
  })
  @Prop({ type: String, required: true })
  productItem: string;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Quantity',
  })
  @Prop({ type: Number, required: true })
  qty: number;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'SubCategory',
  })
  @Prop({ type: String, required: true })
  subcategory: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Category',
  })
  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const StockSchema = SchemaFactory.createForClass(Stock);
export const stockJsonSchema = validationMetadatasToSchemas();
