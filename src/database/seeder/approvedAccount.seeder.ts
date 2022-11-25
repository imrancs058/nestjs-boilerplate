/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { ApprovedAccount } from "../model/approvedAccount.schema";
import { approvedAccountData } from "../data/approvedAccount";

@Injectable()
export class ApprovedAccountSeeder implements Seeder {
  constructor(@InjectModel(ApprovedAccount.name) private readonly approvedAccount: Model<ApprovedAccount>) {}

  async seed(): Promise<any> {
    // Insert into the database.
    return this.approvedAccount.insertMany(approvedAccountData);
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

