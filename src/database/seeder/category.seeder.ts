import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../model/category.schema';
import { Seeder } from 'nestjs-seeder';
import { categoryData } from '../data/category';

@Injectable()
export class CategorySeeder implements Seeder {
  constructor(
    @InjectModel(Category.name) private readonly category: Model<Category>,
  ) {}

  async seed(): Promise<any> {
    // Insert into the database.
    return this.category.insertMany(categoryData);
    // let bb=coaData;
    // const create: COADocument = new this.coa(coaData);
    // return  await create.save().catch((err)=>{
    //   throw new HttpException(err.message, 400);
    //  });;
  }

  async drop(): Promise<any> {
    //return this.user.deleteMany({});
  }
}
