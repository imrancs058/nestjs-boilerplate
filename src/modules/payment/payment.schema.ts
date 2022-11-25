import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';

import { Document } from 'mongoose';
export type PaymentDocument = Payment & Document;

@Schema()
@JSONSchema({
  title: 'Payment',
})
export class Payment {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  })
  name: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const PaymentSchema = SchemaFactory.createForClass(Payment);
export const paymentJsonSchema = validationMetadatasToSchemas();
