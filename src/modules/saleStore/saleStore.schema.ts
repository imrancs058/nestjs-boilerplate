import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type SaleStoreDocument = SaleStore & Document;

@Schema()
@JSONSchema({
  title: 'saleStore',
})
export class SaleStore {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Direction',
  })
  @Prop({ type: String, maxlength: 20, required: true })
  direction: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({ type: String, maxlength: 50, required: true })
  name: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const SaleStoreSchema = SchemaFactory.createForClass(SaleStore);
export const saleStoreJsonSchema = validationMetadatasToSchemas();
