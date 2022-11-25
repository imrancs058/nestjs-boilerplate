import { Module } from '@nestjs/common';
import { ProductItemService } from './productItem.service';
import { ProductItemController } from './productItem.controller';
import { ProductItem, ProductItemSchema } from './productItem.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ProductItem.name, schema: ProductItemSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [ProductItemService],
  controllers: [ProductItemController],
  exports: [ProductItemService],
})
export class ProductItemModule {}
