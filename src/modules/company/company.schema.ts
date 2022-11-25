import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsString } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
export type CompanyDocument = Company & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Company {
  id: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  name: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  address: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  mobile: string;

  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  website: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  email: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  registration_number: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', trim: true })
  vat_number: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  logo: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  sale_logo: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  favicon: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  currency: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', trim: true })
  time_zone: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', trim: true })
  currency_position: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  footer_text: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}

const CompanySchema = SchemaFactory.createForClass(Company);
export const companyJsonSchema = validationMetadatasToSchemas();
export { CompanySchema };
