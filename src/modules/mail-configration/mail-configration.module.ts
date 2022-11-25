import { Module } from '@nestjs/common';
import { MailConfigrationService } from './mail-configration.service';
import { MailConfigrationController } from './mail-configration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MailConfigration,
  MailConfigrationSchema,
} from './mail-configration.schema';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: MailConfigration.name, schema: MailConfigrationSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [MailConfigrationService],
  controllers: [MailConfigrationController],
})
export class MailConfigrationModule {}
