import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, MinLength } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
export type WheatPurityDocument = WheatPurity & Document;

@Schema()
@JSONSchema({
  title: 'WheatPurity',
})
export class WheatPurity {
  id: string;

  @MinLength(10)
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Purchase Order',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' })
  purchaseOrderId: Types.ObjectId;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Grain Weight',
  })
  @Prop({ type: Number, required: true })
  grainWeight: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Purity',
  })
  @Prop({ type: Number, required: true })
  purity: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const WheatPuritySchema = SchemaFactory.createForClass(WheatPurity);
export const wheatJsonSchema = validationMetadatasToSchemas();
