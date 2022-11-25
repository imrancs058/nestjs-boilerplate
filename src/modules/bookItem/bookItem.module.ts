import { Module } from '@nestjs/common';
import { BookItemService } from './bookItem.service';
import { BookItemController } from './bookItem.controller';
import { BookItem, BookItemSchema } from './bookItem.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: BookItem.name, schema: BookItemSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [BookItemService],
  controllers: [BookItemController],
  exports: [BookItemService],
})
export class BookItemModule {}
