import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { generateHash } from '../../common/utils';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
import {
  JSONSchema,
  validationMetadatasToSchemas,
} from 'class-validator-jsonschema';
import { RoleType } from '../../constants/role-type';
export type UserDocument = User & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class User {
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

  @IsEmail()
  @ApiProperty()
  @JSONSchema({
    title: 'Email',
  })
  @Prop({
    type: 'string',
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @IsString()
  @MinLength(5)
  @ApiProperty()
  @JSONSchema({
    title: 'Password',
  })
  @Prop({ type: 'string', required: true, trim: true })
  password: string;

  @IsString()
  @MinLength(11)
  @ApiProperty()
  @JSONSchema({
    title: 'Phone Number',
  })
  @Prop({ type: 'string', required: true, trim: true })
  phone: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @ApiProperty()
  @JSONSchema({
    title: 'Avatar',
  })
  @Prop({ type: 'string', trim: true })
  avatar: string;

  @IsEnum(RoleType)
  @ApiProperty()
  @JSONSchema({
    title: 'Role',
  })
  @Prop({ enum: RoleType, default: RoleType.USER })
  role: string;
}

const UserSchema = SchemaFactory.createForClass(User);

// Hooks
UserSchema.pre<UserDocument>('save', async function (next) {
  this.password = generateHash(this.password);
  next();
});

UserSchema.virtual('id').get(function (this: UserDocument) {
  return this._id.toString();
});
export { UserSchema };
export const userJsonSchema = validationMetadatasToSchemas();
//console.log('schemas=>', JSON.stringify(userJsonSchema)); logger , exclude fileds, test cases
