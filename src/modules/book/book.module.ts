import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book, BookSchema } from './book.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BookItemModule } from '../bookItem/bookItem.module';
import { CustomerModule } from '../customer/customer.module';
import { ProductItemModule } from '../productItem/productItem.module';
import { CategoryModule } from '../category/category.module';
import { SaleOfficerModule } from '../saleOfficer/saleOfficer.module';
import { StockModule } from '../stock/stock.module';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Book.name, schema: BookSchema }],
      dbName.primaryDBName,
    ),
    BookItemModule,
    CustomerModule,
    ProductItemModule,
    CategoryModule,
    SaleOfficerModule,
    StockModule,
  ],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
