import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';

import { IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';
export type PackingSizeDocument = PackingSize & Document;

@JSONSchema({
  title: 'packingSize',
})
@Schema()
export class PackingSize {
  id: string;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Size',
  })
  @Prop({ type: Number, maxlength: 10, required: true })
  size: number;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Unit',
  })
  @Prop({ type: String, required: true })
  unit: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const PackingSizeSchema = SchemaFactory.createForClass(PackingSize);
export const packingJsonSchema = validationMetadatasToSchemas();
