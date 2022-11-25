import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Document } from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
export type PremiumDocument = Premium & Document;

@JSONSchema({
  title: 'Premium',
})
@Schema()
export class Premium {
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({ type: 'string', required: true, trim: true })
  name: string;

  @IsNumber()
  @ApiProperty()
  @JSONSchema({
    title: 'Value',
  })
  @Prop({ type: 'number', required: true })
  value: number;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @JSONSchema({
    title: 'Start Date',
  })
  @Prop({ type: Date })
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  @JSONSchema({
    title: 'End Date',
  })
  @Prop({ type: Date })
  endDate: Date;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const PremiumSchema = SchemaFactory.createForClass(Premium);
export const premiumJsonSchema = validationMetadatasToSchemas();
