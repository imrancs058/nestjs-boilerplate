import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type BookDocument = Book & Document;

@Schema()
@JSONSchema({
  title: 'Book',
})
export class Book {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Book Number',
  })
  @Prop({ type: String, required: true })
  bookNo: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Customer ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  })
  customerId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Sale Officer ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'saleOfficer',
  })
  saleOfficerId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Payment ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  })
  paymentId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Destination',
  })
  @Prop({ type: String, required: true })
  destination: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Area',
  })
  @Prop({ type: String })
  area: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Type',
  })
  @Prop({ type: String })
  type: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Check Number',
  })
  @Prop({ type: String, required: true })
  checkNo: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Category',
  })
  @Prop({ type: String, required: true })
  categoryId: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: 0 })
  isShipped: boolean;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const BookSchema = SchemaFactory.createForClass(Book);
export const bookJsonSchema = validationMetadatasToSchemas();
