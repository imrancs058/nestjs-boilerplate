import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Supplier, SupplierSchema } from './supplier.schema';
import { CoaModule } from '../coa/coa.module';
import { CoaService } from '../coa/coa.service';
import { SUPPLIER } from 'src/constants';
import { FarmAddressModule } from '../farm_address/farm_address.module';
import { dbName } from '../../configration/content.configuration';
@Module({
  imports: [
    CoaModule,
    FarmAddressModule,
    MongooseModule.forFeatureAsync(
      [
        {
          name: Supplier.name,
          imports: [CoaModule],
          useFactory: (coaService: CoaService) => {
            const schema = SupplierSchema;
            schema.post('save', function (data) {
              coaService.create(SUPPLIER, data);
            });
            return schema;
          },
          inject: [CoaService],
        },
      ],
      dbName.primaryDBName,
    ),
  ],

  providers: [SupplierService],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule {}
