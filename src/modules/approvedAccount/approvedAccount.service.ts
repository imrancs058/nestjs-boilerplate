/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ApprovedAccountJsonSchema,
  ApprovedAccount,
  ApprovedAccountDocument,
} from './approvedAccount.schema';
import { ResponseCode } from '../../exceptions';

@Injectable()
export class ApprovedAccountService {
  constructor(
    @InjectModel(ApprovedAccount.name)
    private approvedAccountModel: Model<ApprovedAccount>,
  ) {}

  /**
   * get ApprovedAccount schema
   * @returns
   */
  async getSchema() {
    const approvedAccountSchema = await ApprovedAccountJsonSchema.ApprovedAccount;
    const customSchema = { schema: approvedAccountSchema, uischema: {} };
    return customSchema;
  }

  /**
   * get ApprovedAccount
   * @param pageOptionsDto
   * @returns
   */

  async getApprovedAccountByAsset(name: string): Promise<ApprovedAccount> {
    const resp = await this.approvedAccountModel.findOne({ asset : name});
    return resp;
  }

  /**
   * post
   * @param createDto
   * @returns
   */
  async create(createDto: any): Promise<ApprovedAccountDocument> {
    const create: ApprovedAccountDocument = new this.approvedAccountModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }
}
