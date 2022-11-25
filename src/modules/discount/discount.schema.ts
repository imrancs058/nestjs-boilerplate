import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type DiscountDocument = Discount & Document;

@Schema()
@JSONSchema({
  title: 'Discount',
})
export class Discount {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({ type: String, required: true })
  name: string;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Amount',
  })
  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const DiscountSchema = SchemaFactory.createForClass(Discount);
export const discountJsonSchema = validationMetadatasToSchemas();
