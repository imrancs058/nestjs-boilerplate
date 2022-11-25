import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import mongoose from 'mongoose';
export type COADocument = COA & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class COA {
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @JSONSchema({
    title: 'Key',
  })
  @Prop({ type: 'string', trim: true, required: true })
  key1: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @JSONSchema({
    title: 'Key',
  })
  @Prop({ type: 'string', trim: true })
  key2: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @JSONSchema({
    title: 'Key',
  })
  @Prop({ type: 'string', trim: true })
  key3: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @JSONSchema({
    title: 'Key',
  })
  @Prop({ type: 'string', trim: true })
  key4: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @JSONSchema({
    title: 'Key',
  })
  @Prop({ type: 'string', trim: true })
  key5: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @JSONSchema({
    title: 'Key',
  })
  @Prop({ type: 'string', trim: true })
  key6: string;

  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @JSONSchema({
    title: 'HeadCode',
  })
  @Prop({ type: 'string', trim: true, required: true })
  headCode: string;

  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @JSONSchema({
    title: 'Account Title',
  })
  @Prop({ type: 'string', trim: true, required: true })
  accountTitle: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @JSONSchema({
    title: 'HeadIDFK',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'docModel',
  })
  headIdFK: string;

  docModel: {
    type: string;
    required: true;
    enum: ['PurchaseOrder', 'LabourType', 'CommodityIssueForProduction'];
  };

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @JSONSchema({
    title: 'Depriciation Rate',
  })
  @Prop({ type: 'number', default: 0 })
  depreciationRate: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: 'date', default: new Date() })
  date: Date;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: 'boolean', default: true })
  isActive: boolean;
}

const COASchema = SchemaFactory.createForClass(COA);

COASchema.virtual('id').get(function (this: COADocument) {
  return this._id.toString();
});
export { COASchema };
export const coaJsonSchema = validationMetadatasToSchemas();
