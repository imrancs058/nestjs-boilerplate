import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Stock, StockSchema } from './stock.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductItemModule } from '../productItem/productItem.module';
import { PurchaseOrderModule } from '../purchase-order/purchase-order.module';
import { CategoryModule } from '../category/category.module';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Stock.name, schema: StockSchema }],
      dbName.primaryDBName,
    ),
    ProductItemModule,
    PurchaseOrderModule,
    CategoryModule,
  ],
  providers: [StockService],
  controllers: [StockController],
  exports: [StockService],
})
export class StockModule {}
