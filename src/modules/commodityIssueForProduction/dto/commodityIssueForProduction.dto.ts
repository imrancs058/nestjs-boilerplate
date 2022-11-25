import { IsNumber, IsOptional } from 'class-validator';

export class CommodityIssueForProductionDto {
  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' })
  // purchaseOrderId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
  // storeId: Types.ObjectId;

  @IsNumber()
  @IsOptional()
  remainingBags: number;

  @IsNumber()
  @IsOptional()
  bagsForProduction: number;

  @IsNumber()
  @IsOptional()
  bagSize: number;

  @IsNumber()
  @IsOptional()
  netWeight: number;

  @IsNumber()
  @IsOptional()
  PlantNo: number;

  @IsNumber()
  @IsOptional()
  processNo: number;

  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contractor_Rate' })
  // uploaderRate: Types.ObjectId;

  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contractor_Rate' })
  // downloaderRate: Types.ObjectId;
}
