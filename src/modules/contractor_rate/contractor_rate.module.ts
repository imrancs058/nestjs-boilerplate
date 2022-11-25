import { Module } from '@nestjs/common';
import { ContractorRateService } from './contractor_rate.service';
import { ContractorRateController } from './contractor_rate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Contractor_Rate,
  Contractor_RateSchema,
} from './contractor_rate.schema';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Contractor_Rate.name, schema: Contractor_RateSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [ContractorRateService],
  controllers: [ContractorRateController],
  exports: [ContractorRateService],
})
export class ContractorRateModule {}
