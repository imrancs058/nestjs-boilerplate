/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Types } from 'mongoose';
import { JSONSchema, validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type attendanceDocument = attendance & Document;

@Schema()
@JSONSchema({
  title: 'Attendance',
})
export class attendance {
  id: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Employee ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee', // No Subcategory Module till now
  })
  employeeID: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: Date, default: Date.now })
  timeIn: Date;

  @Prop({ type: Date, default: Date.now })
  timeOut: Date;
  
  @Prop({ type: Date, default: Date.now })
  stayTime: Date;
  
  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const attendanceSchema = SchemaFactory.createForClass(attendance);
export const attendanceJsonSchema = validationMetadatasToSchemas();