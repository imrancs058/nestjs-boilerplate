import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type Farm_AddressDocument = Farm_Address & Document;

@JSONSchema({
  title: 'Farm_Address',
})
@Schema()
export class Farm_Address {
  id: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Supplier',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: false,
  })
  supplierId: Types.ObjectId;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'Tehsil',
  })
  @Prop({ type: 'string', required: true, trim: true })
  tehsil: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'District',
  })
  @Prop({ type: 'string', required: true, trim: true })
  district: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty()
  @JSONSchema({
    title: 'Address',
  })
  @Prop({ type: 'string', required: true, trim: true })
  address: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const Farm_AddressSchema = SchemaFactory.createForClass(Farm_Address);
export const Farm_AddressJsonSchema = validationMetadatasToSchemas();
