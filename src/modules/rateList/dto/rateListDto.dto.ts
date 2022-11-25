import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RateListDtoDto {
  @IsString()
  @IsOptional()
  name: string;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'PackingSize',
  // })
  // packingsize: Types.ObjectId;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Discount',
  // })
  // discount: Types.ObjectId;

  @IsNumber()
  @IsOptional()
  rate: number;
}
