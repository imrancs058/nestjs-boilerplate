import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './category.schema';
import { LoggerService } from '../../logger/logger.service';
import { dbName } from 'src/configration/content.configuration';
@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Category.name, schema: CategorySchema }],
      dbName.primaryDBName,
    ),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, LoggerService],
  exports: [CategoryService],
})
export class CategoryModule {}
