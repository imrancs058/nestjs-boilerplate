import { Module } from '@nestjs/common';
import { RateListService } from './rateList.service';
import { RateListController } from './rateList.controller';
import { RateList, RateListSchema } from './rateList.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: RateList.name, schema: RateListSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [RateListService],
  controllers: [RateListController],
})
export class RateListModule {}
