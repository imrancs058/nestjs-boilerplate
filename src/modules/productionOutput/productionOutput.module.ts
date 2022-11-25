import { Module } from '@nestjs/common';
import { ProductionOutputService } from './productionOutput.service';
import { ProductionOutputController } from './productionOutput.controller';
import {
  ProductionOutput,
  ProductionOutputSchema,
} from './productionOutput.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DryModule } from '../dry/dry.module';
import { PackingModule } from '../packing/packing.module';
import { LabourExpenseModule } from '../labourExpense/labourExpense.module';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ProductionOutput.name, schema: ProductionOutputSchema }],
      dbName.primaryDBName,
    ),
    DryModule,
    PackingModule,
    LabourExpenseModule,
  ],
  providers: [ProductionOutputService],
  controllers: [ProductionOutputController],
})
export class ProductionOutputModule {}
