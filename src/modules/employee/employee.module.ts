import { Module } from '@nestjs/common';
import { employeeService } from './employee.service';
import { employeeController } from './employee.controller';
import { employee, employeeSchema } from './employee.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DesignationModule } from '../designation/designation.module';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: employee.name, schema: employeeSchema }],
      dbName.primaryDBName,
    ),
    DesignationModule,
  ],
  providers: [employeeService],
  controllers: [employeeController],
  exports: [employeeService],
})
export class employeeModule {}
