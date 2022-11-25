import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type ProductionOutputDocument = ProductionOutput & Document;
@JSONSchema({
  title: 'ProductionOutput',
})
@Schema()
export class ProductionOutput {
  id: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Purchase Order ID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' })
  purchaseOrderId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Commodity issue for Production ',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommodityIssueForProduction',
  })
  commodityIssueForProductionId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Raw Slip Number',
  })
  @Prop({
    type: String,
    required: true,
    maxlength: 20,
    minlength: 2,
    trim: true,
  })
  rawSlipNo: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Product Item',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'ProductItem',
  })
  productItemId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'LOT',
  })
  @Prop({
    type: String,
    required: true,
    maxlength: 10,
    minlength: 2,
    trim: true,
  })
  lot: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Packing Size',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'PackingSize',
  })
  packingSize: mongoose.Schema.Types.ObjectId;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'No of Bags',
  })
  @Prop({ type: Number, required: true })
  quantityInBag: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Heap',
  })
  @Prop({ type: Number, required: false })
  heap: number;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Product Number',
  })
  @Prop({
    type: String,
    required: true,
    maxlength: 10,
    minlength: 2,
    trim: true,
  })
  productNo: string;

  @ApiProperty()
  @JSONSchema({
    title: 'radioDryPack',
  })
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  radioDryPack: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Store ID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
  storeId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: Boolean, required: true, default: 1 })
  isActive: boolean;
}
export const ProductionOutputSchema =
  SchemaFactory.createForClass(ProductionOutput);
export const productionOutputJsonSchema = validationMetadatasToSchemas();
