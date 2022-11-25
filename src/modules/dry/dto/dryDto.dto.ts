import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DryDtoDto {
  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'ProductionOutput',
  // })
  // commodityOutputId: Types.ObjectId;

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
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Store' })
  // storeId: Types.ObjectId;

  @IsString()
  @IsOptional()
  lossNumber: string;

  @IsNumber()
  @IsOptional()
  grossStore: number;

  @IsNumber()
  @IsOptional()
  tareStore: number;

  @IsNumber()
  @IsOptional()
  grossDry: number;

  @IsNumber()
  @IsOptional()
  tareDry: number;
}
