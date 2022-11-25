/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { JSONSchema, validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type AccTransactionDocument = AccTransaction & Document;

@Schema()
@JSONSchema({
  title: 'AccTansaction',
})
export class AccTransaction {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Voucher Number',
  })
  @Prop({
    type: 'string',
    minlength: 3,
    maxlength: 30,
    required: true,
    trim: true,
  })
  voucherNumber: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Voucher Type',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
  })
  voucherType: string;

  @ApiProperty()
  @JSONSchema({
    title: 'COA ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'coa',
  })
  coaId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Naration',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
  })
  naration: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Invoice Manual',
  })
  @Prop({
    type: 'string',
    required: false,
  })
  invoiceIdManual: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Debit',
  })
  @Prop({
    type: 'number',
    default: 0,
    required: false,
  })
  debit: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Credit',
  })
  @Prop({
    type: 'number',
    default: 0,
    required: false,
  })
  credit: number;

  @Prop({ type: 'boolean', required: false, default: true })
  isPosted: boolean;

  @Prop({ type: 'boolean', required: false, default: false })
  isOpening: boolean;

  @Prop({ type: Date, default: Date.now, required: false })
  date: Date;
}
export const AccTransactionSchema = SchemaFactory.createForClass(AccTransaction);
export const AccTransactionJsonSchema = validationMetadatasToSchemas();