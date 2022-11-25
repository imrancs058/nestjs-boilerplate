import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class ProductionOutputDtoDto {
  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' })
  // purchaseOrderId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'CommodityIssueForProduction',
  // })
  // commodityIssueForProductionId: Types.ObjectId;

  @IsString()
  @IsOptional()
  rawSlipNo: string;

  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductItem' })
  // productItemId: Types.ObjectId;

  @IsString()
  @IsOptional()
  lot: string;

  @IsString()
  @IsOptional()
  packingSize: Types.ObjectId;

  @IsNumber()
  @IsOptional()
  quantityInBag: number;

  @IsNumber()
  @IsOptional()
  heap: number;

  // @IsString()
  // @IsOptional()
  // productNo: string;

  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
  // storeId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contractor_Rate' })
  // uploaderRate: Types.ObjectId;

  // @ApiProperty()
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Contractor_Rate' })
  // downloaderRate: Types.ObjectId;
}
