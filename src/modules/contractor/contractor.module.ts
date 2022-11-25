import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contractor, ContractorSchema } from './contractor.schema';
import { ContractorService } from './contractor.service';
import { ContractorController } from './contractor.controller';
import { CoaModule } from '../coa/coa.module';
import { CoaService } from '../coa/coa.service';
import { CONTRACTOR } from 'src/constants';
import { ContractorRateModule } from '../contractor_rate/contractor_rate.module';
import { FarmAddressModule } from '../farm_address/farm_address.module';
import { dbName } from 'src/configration/content.configuration';
@Module({
  imports: [
    CoaModule,
    MongooseModule.forFeatureAsync(
      [
        {
          name: Contractor.name,
          imports: [CoaModule],
          useFactory: (coaService: CoaService) => {
            const schema = ContractorSchema;
            schema.post('save', function (data) {
              coaService.create(CONTRACTOR, data);
            });
            return schema;
          },
          inject: [CoaService],
        },
      ],
      dbName.primaryDBName,
    ),
    ContractorRateModule,
    FarmAddressModule,
  ],

  providers: [ContractorService],
  controllers: [ContractorController],
  exports: [ContractorService],
})
export class ContractorModule {}
