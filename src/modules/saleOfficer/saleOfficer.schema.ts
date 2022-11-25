import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type SaleOfficerDocument = SaleOfficer & Document;

@Schema()
@JSONSchema({
  title: 'SaleOfficer',
})
export class SaleOfficer {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'First Name',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  firstName: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Last Name',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  lastName: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Address',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  address: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Area',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  area: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Phone',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 11,
  })
  phone: string;

  @IsEmail()
  @ApiProperty()
  @JSONSchema({
    title: 'Email',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const SaleOfficerSchema = SchemaFactory.createForClass(SaleOfficer);
export const saleOfficerJsonSchema = validationMetadatasToSchemas();
