import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { Store, StoreSchema } from './store.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { dbName } from '../../configration/content.configuration';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Store.name, schema: StoreSchema }],
      dbName.primaryDBName,
    ),
  ],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule {}
