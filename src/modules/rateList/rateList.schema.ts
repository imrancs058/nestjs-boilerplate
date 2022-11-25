import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type RateListDocument = RateList & Document;

@Schema()
@JSONSchema({
  title: 'RateList',
})
export class RateList {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Subcategory',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // No Subcategory Module till now
  })
  subcategory: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Packing Size',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PackingSize',
  })
  packingsize: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Discount',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discount',
  })
  discount: Types.ObjectId;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Rate',
  })
  @Prop({ type: Number, required: true })
  rate: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const RateListSchema = SchemaFactory.createForClass(RateList);
export const rateListJsonSchema = validationMetadatasToSchemas();
