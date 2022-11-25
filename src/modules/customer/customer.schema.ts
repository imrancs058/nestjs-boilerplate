import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';

import { Document } from 'mongoose';
export type CustomerDocument = Customer & Document;

@Schema()
@JSONSchema({
  title: 'Customer',
})
export class Customer {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Shop Name',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  shopName: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Concerned Person',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  concernedPerson: string;

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
    title: 'Zone',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  zone: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'District',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  district: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'City',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  city: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Province',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  province: string;

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

  @Prop({ type: Boolean, required: true, default: 1 })
  isActive: boolean;
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
export const customerJsonSchema = validationMetadatasToSchemas();
