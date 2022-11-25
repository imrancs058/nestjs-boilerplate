import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type ProductItemDocument = ProductItem & Document;

@Schema()
@JSONSchema({
  title: 'ProductItem',
})
export class ProductItem {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({
    type: String,
    required: true,
    maxlength: 30,
    minlength: 3,
    trim: true,
  })
  name: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);
export const productItemJsonSchema = validationMetadatasToSchemas();
