import { Module } from '@nestjs/common';
import { designationService } from './designation.service';
import { designationController } from './designation.controller';
import { designation, designationSchema } from './designation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from "../../configration/content.configuration";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: designation.name, schema: designationSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [designationService],
  controllers: [designationController],
  exports: [designationService],
})
export class DesignationModule {}
