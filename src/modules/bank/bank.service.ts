import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { bankJsonSchema, Bank, BankDocument } from './bank.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { BankDtoDto } from './dto/bankDto.dto';

@Injectable()
export class BankService {
  constructor(
    @InjectModel(Bank.name)
    private bankModel: Model<Bank>,
  ) {}

  /**
   * get bank schema
   * @returns
   */
  async getSchema() {
    const bankSchema = await bankJsonSchema.Bank;
    bankSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: bankSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all bank
   * @param pageOptionsDto
   * @returns
   */

  async getBank(pageOptionsDto: PageOptionsDto): Promise<Bank[]> {
    const queryBuilder = await this.bankModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $addFields: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
          },
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              { $sort: { [pageOptionsDto.column]: pageOptionsDto.order } },
              { $skip: pageOptionsDto.skip },
              { $limit: pageOptionsDto.take },
            ],
          },
        },
        {
          $project: {
            data: 1,
            // Get total from the first element of the metadata array
            total: { $arrayElemAt: ['$metadata.total', 0] },
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }
  /**
   *
   * get single Bank
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Bank[]> {
    const queryBuilder = await this.bankModel
      .find({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  /**
   * post
   * @param createDto
   * @returns
   */
  async create(createDto: Bank): Promise<BankDocument> {
    const create: BankDocument = new this.bankModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & bank object
   * @return
   */
  async update(id: string, bankData: BankDtoDto): Promise<BankDocument> {
    return await this.bankModel
      .findByIdAndUpdate({ _id: id }, bankData)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  /**
   *
   * delete
   * @param id
   * @return
   */
  async delete(id: string): Promise<any> {
    return await this.bankModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
