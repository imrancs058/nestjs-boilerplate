import { Module } from '@nestjs/common';
import { FiscalBookService } from './fiscal-book.service';
import { FiscalBookController } from './fiscal-book.controller';
import { FiscalBook, FiscalBookSchema } from './fiscal-book.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: FiscalBook.name, schema: FiscalBookSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [FiscalBookService],
  controllers: [FiscalBookController],
})
export class FiscalBookModule {}
