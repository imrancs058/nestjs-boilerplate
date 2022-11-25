import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import mongoose from 'mongoose';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type ContractorDocument = Contractor & Document;

@JSONSchema({
  title: 'Contractor',
})
@Schema()
export class Contractor {
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'First Name',
  })
  @Prop({ type: 'string', required: true, trim: true })
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty()
  @JSONSchema({
    title: 'Last Name',
  })
  @Prop({ type: 'string', required: true, trim: true })
  lastName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty()
  @JSONSchema({
    title: 'Address Name',
  })
  @Prop({ type: 'string', required: true, trim: true })
  address: string;

  @IsString()
  @MinLength(13)
  @MaxLength(15)
  @ApiProperty()
  @JSONSchema({
    title: 'CNIC',
  })
  @Prop({ type: 'string', required: true, trim: true })
  cnic: string;

  @IsString()
  @MinLength(11)
  @ApiProperty()
  @JSONSchema({
    title: 'Phone Number',
  })
  @Prop({ type: 'string', required: true, trim: true })
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @JSONSchema({
    title: 'SupervisorId',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contractor',
    required: false,
  })
  supervisorId: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @IsOptional()
  @ApiProperty()
  @JSONSchema({
    title: 'Vehicle Number',
  })
  @Prop({ type: 'string', required: true, trim: true })
  vehicalNumber: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const ContractorSchema = SchemaFactory.createForClass(Contractor);
export const contractorJsonSchema = validationMetadatasToSchemas();
