/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class designationDtoDto {
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

  
  @IsString()
  name: string;

  @IsString()
  description: string;
}
