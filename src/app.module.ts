import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigrationModule } from './configration/configration.module';
import { ConfigrationService } from './configration/configration.service';
import { LoggerModule } from './logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { CoaModule } from './modules/coa/coa.module';
import { CategoryModule } from './modules/category/category.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { FarmAddressModule } from './modules/farm_address/farm_address.module';
import { ContractorModule } from './modules/contractor/contractor.module';
import { ContractorRateModule } from './modules/contractor_rate/contractor_rate.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { StoreModule } from './modules/store/store.module';
import { PremiumModule } from './modules/premium/premium.module';

import { PurchaseOrderModule } from './modules/purchase-order/purchase-order.module';
import { WheatPurityModule } from './modules/wheatPurity/wheatPurity.module';
import { WheatSamplingModule } from './modules/wheatSampling/wheatSampling.module';
import { CottonSamplingModule } from './modules/cottonSampling/cottonSampling.module';
import { StockModule } from './modules/stock/stock.module';
import { SaleStoreModule } from './modules/saleStore/saleStore.module';
import { SaleOfficerModule } from './modules/saleOfficer/saleOfficer.module';
import { RateListModule } from './modules/rateList/rateList.module';
import { ProductItemModule } from './modules/productItem/productItem.module';
import { ProductionOutputModule } from './modules/productionOutput/productionOutput.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PackingModule } from './modules/packing/packing.module';
import { PackingSizeModule } from './modules/packingSize/packingSize.module';
import { DryModule } from './modules/dry/dry.module';
import { DiscountModule } from './modules/discount/discount.module';
import { CustomerModule } from './modules/customer/customer.module';
import { CottonBudTestModule } from './modules/cottonBudTest/cottonBudTest.module';
import { CommodityIssueForProductionModule } from './modules/commodityIssueForProduction/commodityIssueForProduction.module';
import { BookItemModule } from './modules/bookItem/bookItem.module';
import { BookModule } from './modules/book/book.module';
import { BankModule } from './modules/bank/bank.module';
import { attendanceModule } from './modules/attendance/attendance.module';
import { salaryTypeModule } from './modules/salaryType/salaryType.module';
import { employeeSalarySetupModule } from './modules/employeeSalarySetup/employeeSalarySetup.module';
import { employeeModule } from './modules/employee/employee.module';
import { DesignationModule } from './modules/designation/designation.module';
import { salaryGenerateModule } from './modules/salaryGenerate/salaryGenerate.module';
import { labourTypeModule } from './modules/labourType/labourType.module';
import { LabourExpenseModule } from './modules/labourExpense/labourExpense.module';
import { AccTransactionModule } from './modules/acc_transaction/acc-transaction.module';
import { ApprovedAccountModule } from './modules/approvedAccount/approvedAccount.module';

import { PermissionModule } from './modules/permission/permission.module';
import { RoleAclModule } from './modules/role-acl/role-acl.module';
import { MailConfigrationModule } from './modules/mail-configration/mail-configration.module';
import { FiscalBookModule } from './modules/fiscal-book/fiscal-book.module';
import { CompanyModule } from './modules/company/company.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { dbName } from './configration/content.configuration';
@Module({
  imports: [
    UserModule,
    ConfigrationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRootAsync({
      connectionName: dbName.primaryDBName,
      imports: [ConfigrationModule],
      useFactory: async (configService: ConfigrationService) =>
        configService.mongooseConfig,
      inject: [ConfigrationService],
    }),
    MongooseModule.forRootAsync({
      connectionName: dbName.auditLogDBName,
      imports: [ConfigrationModule],
      useFactory: async (configService: ConfigrationService) =>
        configService.mongooseConfigLog,
      inject: [ConfigrationService],
    }),
    LoggerModule,
    AuthModule,
    CaslModule,
    CoaModule,
    CategoryModule,
    SupplierModule,
    FarmAddressModule,
    ContractorModule,
    ContractorRateModule,
    WarehouseModule,
    StoreModule,
    PremiumModule,
    labourTypeModule,
    LabourExpenseModule,
    PurchaseOrderModule,
    WheatPurityModule,
    WheatSamplingModule,
    CottonSamplingModule,
    StockModule,
    SaleStoreModule,
    SaleOfficerModule,
    RateListModule,
    ProductItemModule,
    ProductionOutputModule,
    PaymentModule,
    PackingSizeModule,
    PackingModule,
    DryModule,
    DiscountModule,
    CustomerModule,
    CottonBudTestModule,
    CommodityIssueForProductionModule,
    BookItemModule,
    BookModule,
    BankModule,
    attendanceModule,
    salaryTypeModule,
    employeeSalarySetupModule,
    employeeModule,
    DesignationModule,
    salaryGenerateModule,
    AccTransactionModule,
    ApprovedAccountModule,
    PermissionModule,
    RoleAclModule,
    MailConfigrationModule,
    FiscalBookModule,
    CompanyModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppModule],
})
export class AppModule { }
