import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company, CompanySchema } from './company.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Company.name, schema: CompanySchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
