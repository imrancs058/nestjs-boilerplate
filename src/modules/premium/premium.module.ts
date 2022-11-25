import { Module } from '@nestjs/common';
import { PremiumService } from './premium.service';
import { PremiumController } from './premium.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Premium, PremiumSchema } from './premium.schema';
import { dbName } from 'src/configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Premium.name, schema: PremiumSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [PremiumService],
  controllers: [PremiumController],
  exports: [PremiumService],
})
export class PremiumModule {}
