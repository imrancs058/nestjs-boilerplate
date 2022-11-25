import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsString } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
export type MailConfigrationDocument = MailConfigration & Document;
@Schema({
  toJSON: {
    getters: true,
    virtuals: true,
  },
})
export class MailConfigration {
  id: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  protocol: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  host: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  port: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  senderMail: string;

  @IsString()
  @ApiProperty()
  @Prop({ type: 'string', required: true, trim: true })
  password: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: 'boolean', required: true, default: true })
  isActive: boolean;
}

const MailConfigrationSchema = SchemaFactory.createForClass(MailConfigration);
export const mailConfigrationJsonSchema = validationMetadatasToSchemas();
export { MailConfigrationSchema };
