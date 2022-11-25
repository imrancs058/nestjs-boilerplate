import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { Document } from 'mongoose';
export type RoleAclDocument = RoleAcl & Document;

@JSONSchema({
  title: 'role-acl',
})
@Schema()
export class RoleAcl {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty()
  @JSONSchema({
    title: 'Name',
  })
  @Prop({ type: 'string', required: true, trim: true })
  name: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}
export const RoleAclSchema = SchemaFactory.createForClass(RoleAcl);
export const roleAclJsonSchema = validationMetadatasToSchemas();
