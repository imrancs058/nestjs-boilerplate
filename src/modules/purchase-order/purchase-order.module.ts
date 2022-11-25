import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrder, PurchaseOrderSchema } from './purchase-order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PremiumModule } from '../premium/premium.module';
import { SupplierModule } from '../supplier/supplier.module';
import { CategoryModule } from '../category/category.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { LabourExpenseModule } from '../labourExpense/labourExpense.module';
import { labourTypeModule } from '../labourType/labourType.module';
import { ContractorModule } from '../contractor/contractor.module';
import { AccTransactionModule } from '../acc_transaction/acc-transaction.module';
import { AccTransactionService } from '../acc_transaction/acc_transaction.service';
import { CoaModule } from '../coa/coa.module';
import { CoaService } from '../coa/coa.service';
import { INVENTORY } from 'src/constants';
import { employeeModule } from '../employee/employee.module';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: PurchaseOrder.name,
          imports: [CoaModule, AccTransactionModule],
          useFactory: (
            coaService: CoaService,
            accTransactionService: AccTransactionService,
          ) => {
            const schema = PurchaseOrderSchema;
            schema.post('save', async (data) => {
              if (data['_doc'].fixationStatus) {
                const randomNumber1 = Math.floor(Math.random() * 1000000);
                const randomNumber2 = Math.floor(Math.random() * 1000000);
                const coa = await coaService.findByHeadIdFK(
                  data['_doc'].supplierId,
                );
                if (coa) {
                  const inventoryObj = await coaService.findByHeadName(
                    INVENTORY,
                  );
                  accTransactionService.create({
                    voucherNumber: randomNumber1,
                    voucherType: 'Purchase',
                    coaId: inventoryObj['_doc']._id,
                    naration: `Inventry is Debited for Invoice No ${data['_doc']?.invoiceIdManual}`,
                    debit: data['_doc']?.totalAmount,
                  });
                  accTransactionService.create({
                    voucherNumber: randomNumber2,
                    voucherType: 'Purchase',
                    coaId: coa['_id'],
                    invoiceIdManual: data['_doc']?.invoiceIdManual,
                    naration:
                      'Invoice no of Supplier: ' +
                      data['_doc']?.invoiceIdManual,
                    credit: data['_doc']?.totalAmount,
                  });
                } else {
                  throw new Error('Supplier is not linked with any COA');
                }
              }
            });
            return schema;
          },
          inject: [CoaService, AccTransactionService],
        },
      ],
      dbName.primaryDBName,
    ),
    ContractorModule,

    SupplierModule,
    labourTypeModule,
    LabourExpenseModule,
    PremiumModule,
    WarehouseModule,
    CategoryModule,

    AccTransactionModule,
    CoaModule,
    employeeModule,
  ],

  providers: [PurchaseOrderService],
  controllers: [PurchaseOrderController],
  exports: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
