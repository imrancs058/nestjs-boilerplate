import { Module } from '@nestjs/common';
import { CommodityIssueForProductionService } from './commodityIssueForProduction.service';
import { CommodityIssueForProductionController } from './commodityIssueForProduction.controller';
import {
  CommodityIssueForProduction,
  CommodityIssueForProductionSchema,
} from './commodityIssueForProduction.schema';
import { Dry, DrySchema } from '../dry/dry.schema';
import { Packing, PackingSchema } from '../packing/packing.schema';
import {
  ProductionOutput,
  ProductionOutputSchema,
} from '../productionOutput/productionOutput.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductionOutputService } from '../productionOutput/productionOutput.service';
import { DryService } from '../dry/dry.service';
import { PackingService } from '../packing/packing.service';
import { LabourExpenseModule } from '../labourExpense/labourExpense.module';
import { StockModule } from '../stock/stock.module';
import { ProductItemModule } from '../productItem/productItem.module';
import { PurchaseOrderModule } from '../purchase-order/purchase-order.module';
import { CategoryModule } from '../category/category.module';
import { PackingSizeModule } from '../packingSize/packingSize.module';
import { StoreModule } from '../store/store.module';
import { SaleStoreModule } from '../saleStore/saleStore.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: CommodityIssueForProduction.name,
          schema: CommodityIssueForProductionSchema,
        },
        {
          name: ProductionOutput.name,
          schema: ProductionOutputSchema,
        },
        {
          name: Dry.name,
          schema: DrySchema,
        },
        {
          name: Packing.name,
          schema: PackingSchema,
        },
      ],
      dbName.primaryDBName,
    ),
    LabourExpenseModule,
    StockModule,
    ProductItemModule,
    PurchaseOrderModule,
    CategoryModule,
    PackingSizeModule,
    StoreModule,
    SaleStoreModule,
    WarehouseModule,
  ],
  providers: [
    CommodityIssueForProductionService,
    ProductionOutputService,
    DryService,
    PackingService,
  ],
  controllers: [CommodityIssueForProductionController],
})
export class CommodityIssueForProductionModule {}
