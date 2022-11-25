import { Module } from '@nestjs/common';
import { employeeSalarySetupService } from './employeeSalarySetup.service';
import { employeeSalarySetupController } from './employeeSalarySetup.controller';
import {
  employeeSalarySetup,
  employeeSalarySetupSchema,
} from './employeeSalarySetup.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: employeeSalarySetup.name, schema: employeeSalarySetupSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [employeeSalarySetupService],
  controllers: [employeeSalarySetupController],
})
export class employeeSalarySetupModule {}
