import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type BankDocument = Bank & Document;

@Schema()
@JSONSchema({
  title: 'Bank',
})
export class Bank {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({
    type: 'string',
    minlength: 3,
    maxlength: 30,
    required: true,
    trim: true,
  })
  name: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Account Name',
  })
  @Prop({
    type: 'string',
    minlength: 3,
    maxlength: 30,
    required: true,
    trim: true,
  })
  accountName: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Account Number',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
  })
  accountNumber: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Branch',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
  })
  branch: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const BankSchema = SchemaFactory.createForClass(Bank);
export const bankJsonSchema = validationMetadatasToSchemas();
