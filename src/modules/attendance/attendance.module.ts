import { Module } from '@nestjs/common';
import { attendanceService } from './attendance.service';
import { attendanceController } from './attendance.controller';
import { attendance, attendanceSchema } from './attendance.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: attendance.name, schema: attendanceSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [attendanceService],
  controllers: [attendanceController],
})
export class attendanceModule { }
