import { Order } from '../../constants';
import { Transform, Type, Expose } from 'class-transformer';
import {  IsInt,IsString, MinLength, MaxLength } from 'class-validator';
export class PageOptionsDto {
  @Transform(value => {
    if(value.value===Order.DESC){
      return -1
    }else if(value.value===Order.ASC){
      return 1
    }
    return "Order must be ASC or DESC"
  })
  @IsInt({
    message: 'Order must be ASC or DESC',
  })
  readonly order: 1 |-1 = 1;


  @IsString()
  @MinLength(2)
  @MaxLength(3)
  readonly column: string = '';


  @IsInt()
  @Type(() => Number)
  readonly take: number = 10;


  @IsInt()
  @Type(() => Number)
  readonly skip: number = 0;


  @IsString()
  readonly q?: string;
}
