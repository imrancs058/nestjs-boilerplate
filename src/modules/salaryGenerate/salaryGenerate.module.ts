import { Module } from '@nestjs/common';
import { salaryGenerateService } from './salaryGenerate.service';
import { salaryGenerateController } from './salaryGenerate.controller';
import { salaryGenerate, salaryGenerateSchema } from './salaryGenerate.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: salaryGenerate.name, schema: salaryGenerateSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [salaryGenerateService],
  controllers: [salaryGenerateController],
})
export class salaryGenerateModule {}
