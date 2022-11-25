/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';
import { JSONSchema, validationMetadatasToSchemas } from 'class-validator-jsonschema';

export type CommodityIssueForProductionDocument = CommodityIssueForProduction &
  Document;
  @JSONSchema({
    title: 'CommodityIssueForProduction',
  })
  @Schema()
  export class CommodityIssueForProduction {
    id: string;

    @IsString()
    @ApiProperty()
    @JSONSchema({
      title: 'Purchase Order',
    })
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' })
    purchaseOrderId: Types.ObjectId;

    @IsString()
    @ApiProperty()
    @JSONSchema({
      title: 'Store',
    })
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
    storeId: Types.ObjectId;

    @ApiProperty()
    @JSONSchema({
      title: 'Reamining Bags',
    })
    @Prop({ type: Number, required: false })
    remainingBags: number;

    @IsNumber()
    @ApiProperty()
    @JSONSchema({
      title: 'Bags for Production',
    })
    @Prop({ type: Number, required: true })
    bagsForProduction: number;

    @IsNumber()
    @ApiProperty()
    @JSONSchema({
      title: 'Bag Size',
    })
    @Prop({ type: Number, required: true })
    bagSize: number;

    // @IsNumber()
    // @ApiProperty()
    // @JSONSchema({
    //   title: 'Net Weight',
    // })
    // @Prop({ type: Number, required: true })
    // netWeight: number;

    @IsNumber()
    @ApiProperty()
    @JSONSchema({
      title: 'Plant Number',
    })
    @Prop({ type: Number, required: true })
    PlantNo: number;

    @IsNumber()
    @ApiProperty()
    @JSONSchema({
      title: 'Process Number',
    })
    @Prop({ type: Number, required: true })
    processNo: number;

    @Prop({ type: Date, default: Date.now })
    date: Date;

    @Prop({ type: Boolean, required: true, default: 1 })
    isActive: boolean;
  }
export const CommodityIssueForProductionSchema = SchemaFactory.createForClass(
  CommodityIssueForProduction
);
export const commodityIssueForProductionJsonSchema = validationMetadatasToSchemas();
