import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StockDto {
  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'SaleStore',
  // })
  // salestoreId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'ProductItem',
  // })
  // productItemId: Types.ObjectId;

  @IsString()
  @IsOptional()
  productItem: string;

  @IsString()
  @IsOptional()
  packingsize: string;

  @IsNumber()
  @IsOptional()
  qty: number;

  @IsString()
  @IsOptional()
  subcategory: string;

  @IsString()
  @IsOptional()
  category: string;
}
