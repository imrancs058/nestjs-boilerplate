import { Module } from '@nestjs/common';
import { LabourTypeService } from './labourType.service';
import { LabourTypeController } from './labourType.controller';
import { LabourType, LabourTypeSchema } from './labourType.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: LabourType.name, schema: LabourTypeSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [LabourTypeService],
  controllers: [LabourTypeController],
  exports: [LabourTypeService],
})
export class labourTypeModule {}
