import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoaController } from './coa.controller';
import { CoaService } from './coa.service';
import { COA, COASchema } from './coa.schema';
import { ApprovedAccountModule } from '../approvedAccount/approvedAccount.module';
import { dbName } from 'src/configration/content.configuration';
@Module({
  imports: [
    ApprovedAccountModule,
    MongooseModule.forFeature(
      [{ name: COA.name, schema: COASchema }],
      dbName.primaryDBName,
    ),
  ],
  controllers: [CoaController],
  providers: [CoaService],
  exports: [CoaService],
})
export class CoaModule {}
