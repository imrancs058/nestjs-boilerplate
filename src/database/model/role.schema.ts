import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Permission } from './permission.schema';
export type RoleDocument = Role & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class Role {
  id: string;

  @ApiProperty()
  @Prop()
  role: string;

  @ApiProperty()
  permissions: [Permission];
}

const RoleSchema = SchemaFactory.createForClass(Role);
export { RoleSchema };
