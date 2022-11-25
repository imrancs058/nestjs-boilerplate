import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { Bank, BankSchema } from './bank.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Bank.name, schema: BankSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [BankService],
  controllers: [BankController],
})
export class BankModule {}
