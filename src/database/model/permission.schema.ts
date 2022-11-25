import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
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
  @MinLength(6)
  @MaxLength(6)
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  action: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  subject: string;
}

const PermissionSchema = SchemaFactory.createForClass(Permission);
export { PermissionSchema };
