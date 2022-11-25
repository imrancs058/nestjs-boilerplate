/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccTransactionJsonSchema, AccTransaction, AccTransactionDocument } from './acc_transaction.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { ObjectId } from 'mongodb';

@Injectable()
export class AccTransactionService {
  constructor(
    @InjectModel(AccTransaction.name)
    private accTransactionModel: Model<AccTransaction>,
  ) {}

  /**
   * get AccTransaction schema
   * @returns
   */
  async getSchema() {
    const accTansactionSchema = await AccTransactionJsonSchema.AccTransaction;
    const customSchema = { schema: accTansactionSchema, uischema: {} };
    return customSchema;
  }

  /**
   * get all AccTransaction
   * @param pageOptionsDto
   * @returns
   */

   async getAccTransaction(pageOptionsDto: PageOptionsDto): Promise<AccTransaction[]> {
    const queryBuilder = await this.accTransactionModel
      .aggregate([
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
   * get AccTransaction by COAID
   * @param pageOptionsDto
   * @returns
   */

   async getAccTransactionByCoaID(pageOptionsDto: PageOptionsDto): Promise<AccTransaction[]> {
    const queryBuilder = await this.accTransactionModel
      .aggregate([
        {
          $match: {
            $and:[
              pageOptionsDto['id'] ? { coaId: new ObjectId(pageOptionsDto['id']) } : {},
              // pageOptionsDto['startDate'] ? { date: {$gt: pageOptionsDto['startDate']} } : {},
              // pageOptionsDto['endDate'] ? { date: {$lt: pageOptionsDto['endDate']} } : {},
            ]
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
   * get AccTransaction by COAID and InvoiceManual
   * @param pageOptionsDto
   * @returns
   */

   async getAccTransactionByCoaIDAndInvoice(pageOptionsDto: PageOptionsDto): Promise<AccTransaction[]> {
    const queryBuilder = await this.accTransactionModel
      .aggregate([
        {
          $match: {
            $and:[
              { coaId: new ObjectId(pageOptionsDto['id']) },
              { invoiceIdManual: { $regex : new RegExp(pageOptionsDto['invoice'],'i') } },
            ]
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
   * post
   * @param createDto
   * @returns
   */
  async create(createDto: any): Promise<AccTransactionDocument> {
    const create: AccTransactionDocument = new this.accTransactionModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }
}
