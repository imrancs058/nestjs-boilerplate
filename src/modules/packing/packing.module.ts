import { Module } from '@nestjs/common';
import { PackingService } from './packing.service';
import { PackingController } from './packing.controller';
import { Packing, PackingSchema } from './packing.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PurchaseOrderModule } from '../purchase-order/purchase-order.module';
import { LabourExpenseModule } from '../labourExpense/labourExpense.module';
import { StockModule } from '../stock/stock.module';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Packing.name, schema: PackingSchema }],
      dbName.primaryDBName,
    ),
    PurchaseOrderModule,
    LabourExpenseModule,
    StockModule,
  ],
  providers: [PackingService],
  controllers: [PackingController],
  exports: [PackingService],
})
export class PackingModule {}
