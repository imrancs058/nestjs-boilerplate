import { Module } from '@nestjs/common';
import { LabourExpenseService } from './labourExpense.service';
import { LabourExpenseController } from './labourExpense.controller';
import { LabourExpense, LabourExpenseSchema } from './labourExpense.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LabourType, LabourTypeSchema } from '../labourType/labourType.schema';
import { LabourTypeService } from '../labourType/labourType.service';
import { ContractorModule } from '../contractor/contractor.module';
import { CoaModule } from '../coa/coa.module';
import { dbName } from '../../configration/content.configuration';
@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: LabourExpense.name, schema: LabourExpenseSchema },
        { name: LabourType.name, schema: LabourTypeSchema },
      ],
      dbName.primaryDBName,
    ),
    ContractorModule,
    CoaModule,
  ],
  providers: [LabourExpenseService, LabourTypeService],
  controllers: [LabourExpenseController],
  exports: [LabourExpenseService],
})
export class LabourExpenseModule {}
