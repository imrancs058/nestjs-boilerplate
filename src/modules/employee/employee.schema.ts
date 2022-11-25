import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose, { Types } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type employeeDocument = employee & Document;

@Schema()
@JSONSchema({
  title: 'Employee',
})
export class employee {
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @ApiProperty()
  @JSONSchema({
    title: 'First Name',
  })
  @Prop({ type: String, required: true })
  fname: string;

  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @ApiProperty()
  @JSONSchema({
    title: 'Last Name',
  })
  @Prop({ type: String, required: true })
  lname: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Designation',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'designation',
  })
  designationId: Types.ObjectId;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'CNIC',
  })
  @Prop({ type: String, required: false, minlength: 13 })
  cnic: string;

  @IsString()
  @MinLength(11)
  @ApiProperty()
  @JSONSchema({
    title: 'Phone Number',
  })
  @Prop({ type: String, required: true })
  phone: string;

  @ApiProperty()
  @IsNumber()
  @JSONSchema({
    title: 'Salary',
  })
  @Prop({ type: Number, required: true })
  salary: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Email',
  })
  @Prop({ type: String, required: false })
  email: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Address',
  })
  @Prop({ type: String, required: true })
  address: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Date of Joining',
  })
  @Prop({ type: String, required: true })
  joinDate: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Date of Termination',
  })
  @Prop({ type: String })
  terminationDate: string;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;

  @Prop({ type: Date, default: Date.now })
  date: Date;
}
export const employeeSchema = SchemaFactory.createForClass(employee);
export const employeeJsonSchema = validationMetadatasToSchemas();
