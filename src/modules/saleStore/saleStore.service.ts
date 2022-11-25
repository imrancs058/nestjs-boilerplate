import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import {
  saleStoreJsonSchema,
  SaleStore,
  SaleStoreDocument,
} from './saleStore.schema';
import { SaleStoreDto } from './dto/saleStore.dto';

@Injectable()
export class SaleStoreService {
  constructor(
    @InjectModel(SaleStore.name)
    private saleStoreModel: Model<SaleStore>,
  ) {}

  /**
   * get sale Store schema
   * @returns
   */
  async getSchema() {
    const saleStoreSchema = await saleStoreJsonSchema.SaleStore;
    saleStoreSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: saleStoreSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all saleStore
   * @param pageOptionsDto
   * @returns
   */

  async getSaleStore(pageOptionsDto: PageOptionsDto): Promise<SaleStore[]> {
    const queryBuilder = await this.saleStoreModel
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
   * get single SaleStore
   * @param id
   * @returns
   */
  async findById(id: string): Promise<SaleStore[]> {
    const queryBuilder = await this.saleStoreModel
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
  async create(createDto: SaleStoreDto): Promise<SaleStoreDocument> {
    const create: SaleStoreDocument = new this.saleStoreModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & saleStore object
   * @return
   */
  async update(
    id: string,
    saleStoreData: SaleStoreDto,
  ): Promise<SaleStoreDocument> {
    return await this.saleStoreModel
      .findByIdAndUpdate({ _id: id }, saleStoreData)
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
    return await this.saleStoreModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
