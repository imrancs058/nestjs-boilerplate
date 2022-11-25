import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type DryDocument = Dry & Document;
@JSONSchema({
  title: 'Dry',
})
@Schema()
export class Dry {
  id: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Commodity Output ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductionOutput',
  })
  productionOutputId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Store ID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
  storeId: Types.ObjectId;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Loss Number',
  })
  @Prop({ type: String, maxlength: 70, required: true })
  lossNumber: string;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Gross Weight',
  })
  @Prop({ type: Number, required: true })
  grossWeight: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Tare Weight',
  })
  @Prop({ type: Number, required: true })
  tareWeight: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Gross Dry',
  })
  @Prop({ type: Number, required: true })
  grossDry: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Tare Dry',
  })
  @Prop({ type: Number, required: true })
  tareDry: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Issued Bags',
  })
  @Prop({ type: Number, required: true, default: 0 })
  issuedBags: number;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Shortage Bags',
  })
  @Prop({ type: Number, required: true, default: 0 })
  shortageBags: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const DrySchema = SchemaFactory.createForClass(Dry);
export const dryJsonSchema = validationMetadatasToSchemas();
