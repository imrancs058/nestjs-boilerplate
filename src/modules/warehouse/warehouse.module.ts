import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { Warehouse, WarehouseSchema } from './warehouse.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreModule } from '../store/store.module';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Warehouse.name, schema: WarehouseSchema }],
      dbName.primaryDBName,
    ),
    StoreModule,
  ],
  providers: [WarehouseService],
  controllers: [WarehouseController],
  exports: [WarehouseService],
})
export class WarehouseModule {}
