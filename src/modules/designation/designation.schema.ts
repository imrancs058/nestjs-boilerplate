/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Document } from 'mongoose';
import { JSONSchema, validationMetadatasToSchemas } from 'class-validator-jsonschema';

export type designationDocument = designation & Document;

@Schema()
@JSONSchema({
  title: 'Designation',
})
export class designation {
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({ type: String, required: true })
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'Description',
  })
  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: Date.now })
  date: Date;
}
export const designationSchema = SchemaFactory.createForClass(designation);
export const designationJsonSchema = validationMetadatasToSchemas();