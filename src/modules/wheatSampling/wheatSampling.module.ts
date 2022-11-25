import { Module } from '@nestjs/common';
import { WheatSamplingService } from './wheatSampling.service';
import { WheatSamplingController } from './wheatSampling.controller';
import { WheatSampling, WheatSamplingSchema } from './wheatSampling.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { SupplierModule } from '../supplier/supplier.module';
import { FarmAddressModule } from '../farm_address/farm_address.module';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: WheatSampling.name, schema: WheatSamplingSchema }],
      dbName.primaryDBName,
    ),
    CategoryModule,
    SupplierModule,
    FarmAddressModule,
  ],
  providers: [WheatSamplingService],
  controllers: [WheatSamplingController],
})
export class WheatSamplingModule {}
