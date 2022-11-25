import { Module } from '@nestjs/common';
import { AccTransaction, AccTransactionSchema } from './acc_transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AccTransactionService } from './acc_transaction.service';
import { AccTransactionController } from './acc_transaction.controller';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: AccTransaction.name, schema: AccTransactionSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [AccTransactionService],
  controllers: [AccTransactionController],
  exports: [AccTransactionService],
})
export class AccTransactionModule {}
