import { Module } from '@nestjs/common';
import { CottonSamplingService } from './cottonSampling.service';
import { CottonSamplingController } from './cottonSampling.controller';
import { CottonSampling, CottonSamplingSchema } from './cottonSampling.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { SupplierModule } from '../supplier/supplier.module';
import { FarmAddressModule } from '../farm_address/farm_address.module';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CottonSampling.name, schema: CottonSamplingSchema }],
      dbName.primaryDBName,
    ),
    CategoryModule,
    SupplierModule,
    FarmAddressModule,
  ],
  providers: [CottonSamplingService],
  controllers: [CottonSamplingController],
})
export class CottonSamplingModule {}
