import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import mongoose from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type LabourExpenseDocument = LabourExpense & Document;

@Schema()
export class LabourExpense {
  id: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Contractor Rate',
  })
  @Prop({ type: String, required: true })
  contractorRateID: string;

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Contractor',
  })
  @Prop({ type: String, required: false })
  contractorID: string;

  @ApiProperty()
  @JSONSchema({
    title: 'Asset ID',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'docModel',
  })
  assetId: string;

  docModel: {
    type: string;
    required: true;
    enum: [
      'PurchaseOrder',
      'LabourType',
      'CommodityIssueForProduction',
      'Dry',
      'Packing',
      'ProductionOutput',
    ];
  };

  @IsString()
  @ApiProperty()
  @JSONSchema({
    title: 'Type',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'LabourType' })
  typeId: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const LabourExpenseSchema = SchemaFactory.createForClass(LabourExpense);
export const LabourExpenseJsonSchema = validationMetadatasToSchemas();
