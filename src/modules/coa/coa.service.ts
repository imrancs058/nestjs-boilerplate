/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseCode } from '../../exceptions';
import { coaJsonSchema, COA, COADocument } from './coa.schema';
import { Model } from 'mongoose';
import { ApprovedAccountService } from '../approvedAccount/approvedAccount.service';
@Injectable()
export class CoaService {
  constructor(
    @InjectModel(COA.name) private coaModel: Model<COADocument>,
    private readonly approvedAccountService: ApprovedAccountService,
  ) {}

  /**
   * get coa schema
   * @returns
   */
  async getSchema() {
    return await coaJsonSchema.Category;
  }

  async findChildByHead(code: string): Promise<COA[] | null> {
    const regex = new RegExp(`^${code}-\\d{2}$`);
    const coa = await this.coaModel.find({ headCode: regex }).catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
    return coa;
  }

  async getCOAList (): Promise<COA[] | null> {
    const coa = await this.coaModel.find().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
    return coa;
  }

  async findByHeadIdFK(id: string): Promise<COA> {
    const coa = await this.coaModel.findOne({ headIdFK: id }).catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
    return coa;
  }

  async findByHeadName(name: string): Promise<COA> {
    const coa = await this.coaModel
      .findOne({ accountTitle: name })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return coa;
  }

  /**
   * post
   * @param createDto
   * @returns
   */
  async create(type: string, entity: any): Promise<COADocument> {
    const approvedAccount =
      await this.approvedAccountService.getApprovedAccountByAsset(type);
    const coaObj = await this.getNextCoaKey(approvedAccount.accountId);
    Object.assign(coaObj, { headIdFK: entity._doc._id });
    console.log(entity._doc._id);
    Object.assign(coaObj, {
      accountTitle: entity._doc.firstName + ' ' + entity._doc.lastName,
    });
    const create: COADocument = new this.coaModel(coaObj);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   * post
   * @param headCode
   * @returns
   */
  async getNextCoaKey(headCode: string): Promise<any> {
    const coa = await this.findChildByHead(headCode);
    const splittedCode = headCode.split('-');
    const obj = {};
    for (let i = 0; i < splittedCode.length; i++) {
      Object.assign(obj, { [`key${i + 1}`]: splittedCode[i] });
    }
    if (coa.length === 0) {
      Object.assign(obj, { [`key${splittedCode.length + 1}`]: '01' });
    } else {
      Object.assign(obj, {
        [`key${splittedCode.length + 1}`]: '0' + (coa.length + 1),
      });
    }
    Object.assign(obj, {
      headCode: headCode + '-' + obj[`key${splittedCode.length + 1}`],
    });
    return obj;
  }
}
