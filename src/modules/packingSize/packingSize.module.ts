import { Module } from '@nestjs/common';
import { PackingSizeService } from './packingSize.service';
import { PackingSizeController } from './packingSize.controller';
import { PackingSize, PackingSizeSchema } from './packingSize.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: PackingSize.name, schema: PackingSizeSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [PackingSizeService],
  controllers: [PackingSizeController],
  exports: [PackingSizeService],
})
export class PackingSizeModule {}
