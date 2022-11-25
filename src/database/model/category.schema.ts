import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { JSONSchema } from 'class-validator-jsonschema';
import { CategoryStatus } from 'src/constants';
export type CategoryDocument = Category & Document;
@JSONSchema({
  title: 'Category',
})
@Schema()
export class Category {
  id: string;

  @MinLength(10)
  @IsOptional()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Prop({ type: 'string', required: true, trim: true })
  name: string;

  @IsOptional()
  @IsEnum(CategoryStatus)
  @Prop({ type: String, required: false, enum: CategoryStatus })
  status: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
