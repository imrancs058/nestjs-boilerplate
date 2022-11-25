import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import mongoose from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type StoreDocument = Store & Document;

@Schema()
export class Store {
  id: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Warehouse ID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' })
  warehouseId: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Store ID',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
  storeId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({ type: 'string', required: true, trim: true })
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty()
  @JSONSchema({
    title: 'Direction',
  })
  @Prop({ type: 'string', required: true, trim: true })
  direction: string;

  @Prop({ type: 'boolean', required: true, default: true })
  isOccupy: boolean;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: Date.now })
  date: Date;
}
export const StoreSchema = SchemaFactory.createForClass(Store);
export const storeJsonSchema = validationMetadatasToSchemas();
