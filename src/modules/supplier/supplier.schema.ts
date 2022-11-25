import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { Document } from 'mongoose';
export type SupplierDocument = Supplier & Document;
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
@JSONSchema({
  title: 'Supplier',
})
@Schema()
export class Supplier {
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'First Name',
  })
  @Prop({ type: 'string', required: true, trim: true })
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'Last Name',
  })
  @Prop({ type: 'string', required: true, trim: true })
  lastName: string;

  @IsString()
  @MinLength(11)
  @ApiProperty()
  @JSONSchema({
    title: 'Phone Number',
  })
  @Prop({ type: 'string', required: true, trim: true })
  phone: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty()
  @JSONSchema({
    title: 'Address',
  })
  @Prop({ type: 'string', required: true, trim: true })
  address: string;

  @IsString()
  @MinLength(13)
  @MaxLength(15)
  @ApiProperty()
  @JSONSchema({
    title: 'CNIC',
  })
  @Prop({ type: 'string', required: true, trim: true })
  cnic: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty()
  @JSONSchema({
    title: 'Area',
  })
  @Prop({ type: 'string', required: true, trim: true })
  area: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty()
  @JSONSchema({
    title: 'Province',
  })
  @Prop({ type: 'string', required: true, trim: true })
  province: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const SupplierSchema = SchemaFactory.createForClass(Supplier);
export const supplierJsonSchema = validationMetadatasToSchemas();
