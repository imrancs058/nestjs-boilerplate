import { Module } from '@nestjs/common';
import { WheatPurityService } from './wheatPurity.service';
import { WheatPurityController } from './wheatPurity.controller';
import { WheatPurity, WheatPuritySchema } from './wheatPurity.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: WheatPurity.name, schema: WheatPuritySchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [WheatPurityService],
  controllers: [WheatPurityController],
})
export class WheatPurityModule {}
