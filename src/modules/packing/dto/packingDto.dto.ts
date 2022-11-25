import { IsNumber, IsOptional } from 'class-validator';

export class PackingDtoDto {
  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'PackingSize',
  // })
  // packingsizeId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Dry',
  // })
  // dryId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Contractor',
  // })
  // uploaderId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Contractor',
  // })
  // downloaderId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'ProductItem',
  // })
  // productItemId: Types.ObjectId;

  @IsNumber()
  @IsOptional()
  movedQty: number;

  @IsNumber()
  @IsOptional()
  qty: number;
}
