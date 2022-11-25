import { Module } from '@nestjs/common';
import { salaryTypeService } from './salaryType.service';
import { salaryTypeController } from './salaryType.controller';
import { salaryType, salaryTypeSchema } from './salaryType.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: salaryType.name, schema: salaryTypeSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [salaryTypeService],
  controllers: [salaryTypeController],
})
export class salaryTypeModule {}
