import { Module } from '@nestjs/common';
import { SaleOfficerService } from './saleOfficer.service';
import { SaleOfficerController } from './saleOfficer.controller';
import { SaleOfficer, SaleOfficerSchema } from './saleOfficer.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SaleOfficer.name, schema: SaleOfficerSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [SaleOfficerService],
  controllers: [SaleOfficerController],
  exports: [SaleOfficerService],
})
export class SaleOfficerModule {}
