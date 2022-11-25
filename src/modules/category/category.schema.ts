import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
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
  @ApiProperty()
  @JSONSchema({
    title: 'Category',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  categoryId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({ type: 'string', required: true, trim: true })
  name: string;

  @IsEnum(CategoryStatus)
  @ApiProperty()
  @JSONSchema({
    title: 'Status',
  })
  @Prop({ type: String, required: true, enum: CategoryStatus })
  status: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export const cateforyJsonSchema = validationMetadatasToSchemas();
