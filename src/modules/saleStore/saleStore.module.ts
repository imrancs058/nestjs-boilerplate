import { Module } from '@nestjs/common';
import { SaleStoreService } from './saleStore.service';
import { SaleStoreController } from './saleStore.controller';
import { SaleStore, SaleStoreSchema } from './saleStore.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SaleStore.name, schema: SaleStoreSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [SaleStoreService],
  controllers: [SaleStoreController],
  exports: [SaleStoreService],
})
export class SaleStoreModule {}
