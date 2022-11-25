import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { Discount, DiscountSchema } from './discount.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Discount.name, schema: DiscountSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [DiscountService],
  controllers: [DiscountController],
})
export class DiscountModule {}
