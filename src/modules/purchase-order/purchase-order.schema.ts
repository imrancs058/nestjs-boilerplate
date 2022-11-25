import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
import { FixType, RateType } from '../../constants';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type PurchaseOrderDocument = PurchaseOrder & Document;
@JSONSchema({
  title: 'PurchaseOrder',
})
@Schema()
export class PurchaseOrder {
  id: string;

  @MinLength(6)
  @ApiProperty()
  @JSONSchema({
    title: 'Category ID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryId: Types.ObjectId;

  @MinLength(6)
  @ApiProperty()
  @JSONSchema({
    title: 'Supplier ID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' })
  supplierId: Types.ObjectId;

  @MinLength(10)
  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Store ID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
  storeId: Types.ObjectId;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Uploader Bag',
  })
  @Prop({ type: Number, required: true })
  uploaderBag: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Downloader Bag',
  })
  @Prop({ type: Number, required: true, min: 1 })
  downloaderBag: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Carriage Bag',
  })
  @Prop({ type: Number, required: true, min: 1 })
  carriageBag: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Fake Carriage Weight',
  })
  @Prop({ type: Number, required: true, default: 0 })
  fakeCarriageWeight: number;

  @IsString()
  @MaxLength(10)
  @ApiProperty()
  @JSONSchema({
    title: 'Invoice Manual',
  })
  @Prop({ type: String, required: false })
  invoiceIdManual: string;

  @IsString()
  @MinLength(3)
  // @MaxLength(10)
  @ApiProperty()
  @JSONSchema({
    title: 'Vehicle Number',
  })
  @Prop({ type: String, required: true, trim: true })
  vehicleNumber: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  // @MaxLength(10)
  @ApiProperty()
  @JSONSchema({
    title: 'Driver Name',
  })
  @Prop({ type: String, required: false, trim: true })
  driverName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @ApiProperty()
  @JSONSchema({
    title: 'Gate Pass',
  })
  @Prop({ type: String, required: true, trim: true })
  gatePass: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Purchase Date',
  })
  @Prop({ type: Date, default: Date.now })
  purchaseDate: Date;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Convey Number',
  })
  @Prop({ type: String, required: false })
  conveyno: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Storage Slip Number',
  })
  @Prop({ type: String, required: false })
  storageSlipNo: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Purity',
  })
  @Prop({ type: String, required: false })
  purity: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Uploader Clerk',
  })
  @Prop({ type: String, required: false })
  uploaderClerk: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Downloader Clerk',
  })
  @Prop({ type: String, required: false })
  downloaderClerk: string;

  @MaxLength(50)
  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Note',
  })
  @Prop({ type: String, required: false })
  note: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Tip',
  })
  @Prop({ type: Number, required: false, default: 0 })
  tip: number;

  //for weights
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Farm Gross',
  })
  @Prop({ type: Number, required: true })
  farmGross: number;

  //for weights

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Farm Tare',
  })
  @Prop({ type: Number, required: true })
  farmTare: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Factory Gross',
  })
  @Prop({ type: Number, required: true })
  factoryGross: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Factory Tare',
  })
  @Prop({ type: Number, required: true })
  factoryTare: number;

  //for deductions

  //for wheat deduction
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Bardana',
  })
  @Prop({ type: Number, required: false })
  bardana: number;

  //for wheat deduction
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Kanta',
  })
  @Prop({ type: Number, required: false })
  kanta: number;

  //for Cotton deduction
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Sangli',
  })
  @Prop({ type: Number, required: false })
  sangli: number;

  //for Cotton deduction
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Moisture',
  })
  @Prop({ type: Number, required: false })
  moisture: number;

  //for Extra deduction
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Other',
  })
  @Prop({ type: Number, required: false })
  other: number;

  //for fixation
  @MinLength(10)
  @IsOptional()
  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Premium',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Premium',
    required: false,
  })
  premium: Types.ObjectId;

  //for fixation
  @IsOptional()
  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Premium Value',
  })
  @Prop({
    type: String,
    ref: 'Premium',
    required: false,
  })
  premiumVal: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Rate',
  })
  @Prop({ type: Number, required: false })
  rate: number;

  @IsEnum(RateType)
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Rate Type',
  })
  @Prop({ type: String, required: false, enum: RateType })
  rateType: string;

  @MaxLength(10)
  @IsOptional()
  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Page Reference',
  })
  @Prop({ type: String, required: false })
  pageRef: string;

  @IsEnum(FixType)
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Fix Type',
  })
  @Prop({
    type: String,
    required: false,
    enum: FixType,
  })
  fixType: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Image',
  })
  @Prop({ type: String, required: false })
  image: string;

  @IsString()
  @IsOptional()
  @Prop({ type: Date, default: Date.now })
  fixationDate: Date;

  // if bags are equal then false else true
  @ApiProperty()
  @Prop({ type: Boolean, required: true, default: false })
  suspect: boolean;

  // if true then un-editable
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Fixation Status',
  })
  @Prop({ type: Boolean, required: true, default: false })
  fixationStatus = false;

  //for invoice
  // 0 mean partially or unpaid 1 mean fully paid and clear
  @ApiProperty()
  @Prop({ type: Boolean, required: true, default: 0 })
  status: boolean;

  @ApiProperty()
  @Prop({ type: Number, required: true, default: 0 })
  paidAmount: number;

  @ApiProperty()
  @Prop({ type: Number, required: false })
  totalAmount: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  //for deletion
  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const PurchaseOrderSchema = SchemaFactory.createForClass(PurchaseOrder);
export const purchaseOrderJsonSchema = validationMetadatasToSchemas();
