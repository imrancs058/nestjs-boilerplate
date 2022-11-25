import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type employeeSalarySetupDocument = employeeSalarySetup & Document;

@Schema()
@JSONSchema({
  title: 'EmployeeSalarySetup',
})
export class employeeSalarySetup {
  id: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Employee ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'emplpoyee',
  })
  employeeId: Types.ObjectId;

  @ApiProperty()
  @JSONSchema({
    title: 'Salary Type ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'salaryType',
  })
  salaryTypeId: Types.ObjectId;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Amount',
  })
  @Prop({ type: 'number', required: true })
  amount: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const employeeSalarySetupSchema =
  SchemaFactory.createForClass(employeeSalarySetup);
export const employeeSalarySetupJsonSchema = validationMetadatasToSchemas();
