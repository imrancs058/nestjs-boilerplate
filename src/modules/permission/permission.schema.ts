import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types } from 'mongoose';
import { IsString, MinLength, MaxLength } from 'class-validator';

export type PermissionDocument = Permission & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Permission {
  id: string;

  @IsString()
  @MinLength(4)
  @MaxLength(6)
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  action: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'RoleAcl' })
  role_acl_id: Types.ObjectId;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  subject: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}

const PermissionSchema = SchemaFactory.createForClass(Permission);
export { PermissionSchema };
