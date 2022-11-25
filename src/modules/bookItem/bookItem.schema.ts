import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';

export type BookItemDocument = BookItem & Document;

@Schema()
@JSONSchema({
  title: 'BookItem',
})
export class BookItem {
  id: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Item ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductItem',
  })
  itemId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Book ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  })
  bookId: Types.ObjectId;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Quantity',
  })
  @Prop({ type: Number, required: true })
  qty: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const BookItemSchema = SchemaFactory.createForClass(BookItem);
export const bookJsonSchema = validationMetadatasToSchemas();
