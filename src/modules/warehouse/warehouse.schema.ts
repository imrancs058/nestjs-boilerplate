import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type WarehouseDocument = Warehouse & Document;

@JSONSchema({
  title: 'Warehouse',
})
@Schema()
export class Warehouse {
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({ type: 'string', required: false, trim: true })
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty()
  @JSONSchema({
    title: 'Address',
  })
  @Prop({ type: 'string', required: false, trim: true })
  address: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
export const warehouseJsonSchema = validationMetadatasToSchemas();
