import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsString } from 'class-validator';
export type FiscalBookDocument = FiscalBook & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class FiscalBook {
  id: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  year: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  start_date: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  end_date: string;

  @ApiProperty()
  @Prop({ type: 'boolean', required: true, default: false })
  is_closed: boolean;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  next_year: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  book_currency: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  description: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}

const FiscalBookSchema = SchemaFactory.createForClass(FiscalBook);
export { FiscalBookSchema };
