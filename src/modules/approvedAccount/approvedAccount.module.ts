import { Module } from '@nestjs/common';
import {
  ApprovedAccount,
  ApprovedAccountSchema,
} from './approvedAccount.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ApprovedAccountService } from './approvedAccount.service';
import { ApprovedAccountController } from './approvedAccount.controller';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ApprovedAccount.name, schema: ApprovedAccountSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [ApprovedAccountService],
  controllers: [ApprovedAccountController],
  exports: [ApprovedAccountService],
})
export class ApprovedAccountModule {}
