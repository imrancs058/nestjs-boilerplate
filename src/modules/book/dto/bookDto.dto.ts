import { IsOptional, IsString } from 'class-validator';

export class BookDtoDto {
  @IsString()
  @IsOptional()
  bookNo: string;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Customer',
  // })
  // customerId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'saleOfficer',
  // })
  // saleOfficerId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Payment',
  // })
  // paymentId: Types.ObjectId;

  @IsString()
  @IsOptional()
  destination: string;

  @IsString()
  @IsOptional()
  area: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  checkNo: string;

  @IsString()
  @IsOptional()
  category: string;
}
