import { Module } from '@nestjs/common';
import { FarmAddressService } from './farm_address.service';
import { FarmAddressController } from './farm_address.controller';
import { Farm_Address, Farm_AddressSchema } from './farm_address.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Farm_Address.name, schema: Farm_AddressSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [FarmAddressService],
  controllers: [FarmAddressController],
  exports: [FarmAddressService],
})
export class FarmAddressModule {}
