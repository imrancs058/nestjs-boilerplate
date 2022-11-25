import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type LabourTypeDocument = LabourType & Document;

@Schema()
@JSONSchema({
  title: 'LabourType',
})
export class LabourType {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({
    type: 'string',
    minlength: 3,
    maxlength: 20,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const LabourTypeSchema = SchemaFactory.createForClass(LabourType);
export const LabourTypeJsonSchema = validationMetadatasToSchemas();
