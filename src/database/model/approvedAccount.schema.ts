/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {  IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export type ApprovedAccountDocument = ApprovedAccount & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class ApprovedAccount {
  id:string

  @IsString()
  @Prop({ type: "string", trim: true, required:true })
  asset:string

  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "string", trim: true, required:true })
  accountId:string

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "date",default:new Date() })
  date:Date

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(14)
  @Prop({ type: "boolean",default:true })
  isActive:boolean

}

const ApprovedAccountSchema = SchemaFactory.createForClass(ApprovedAccount);
export {ApprovedAccountSchema}

