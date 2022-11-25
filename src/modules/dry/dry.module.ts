import { Module } from '@nestjs/common';
import { DryService } from './dry.service';
import { DryController } from './dry.controller';
import { Dry, DrySchema } from './dry.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PackingModule } from '../packing/packing.module';
import { LabourExpenseModule } from '../labourExpense/labourExpense.module';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Dry.name, schema: DrySchema }],
      dbName.primaryDBName,
    ),
    PackingModule,
    LabourExpenseModule,
  ],
  providers: [DryService],
  controllers: [DryController],
  exports: [DryService],
})
export class DryModule {}
