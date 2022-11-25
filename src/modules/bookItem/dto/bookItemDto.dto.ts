import { IsNumber, IsOptional } from 'class-validator';

export class BookItemDtoDto {
  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'ProductItem',
  // })
  // itemId: Types.ObjectId;

  // @ApiProperty()
  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Book',
  // })
  // bookId: Types.ObjectId;

  @IsNumber()
  @IsOptional()
  qty: number;
}
