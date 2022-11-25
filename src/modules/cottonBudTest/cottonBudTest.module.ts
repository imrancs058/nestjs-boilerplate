import { Module } from '@nestjs/common';
import { CottonBudTestService } from './cottonBudTest.service';
import { CottonBudTestController } from './cottonBudTest.controller';
import { CottonBudTest, CottonBudTestSchema } from './cottonBudTest.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: CottonBudTest.name, schema: CottonBudTestSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [CottonBudTestService],
  controllers: [CottonBudTestController],
})
export class CottonBudTestModule {}
