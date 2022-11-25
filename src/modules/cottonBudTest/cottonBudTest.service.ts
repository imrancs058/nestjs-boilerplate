import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CottonBudTest,
  CottonBudTestDocument,
  cottonJsonSchema,
} from './cottonBudTest.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';

@Injectable()
export class CottonBudTestService {
  constructor(
    @InjectModel(CottonBudTest.name)
    private cottonBudTestModel: Model<CottonBudTest>,
  ) {}

  /**
   * get cotton schema
   * @returns
   */
  async getSchema() {
    const cottonSchema = await cottonJsonSchema.CottonBudTest;
    cottonSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: cottonSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        purchaseOrderId: { 'ui:widget': 'myCustomAsyncPurchaseTypeAhead' },
      },
    };
    return customSchema;
  }

  /**
   * get all cottonBudTest
   * @param pageOptionsDto
   * @returns
   */

  async getCottonBudTest(
    pageOptionsDto: PageOptionsDto,
  ): Promise<CottonBudTest[]> {
    const queryBuilder = await this.cottonBudTestModel
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
   * get single CottonBudTest
   * @param id
   * @returns
   */
  async findById(id: string): Promise<CottonBudTest[]> {
    const queryBuilder = await this.cottonBudTestModel
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
  async create(createDto: CottonBudTest): Promise<CottonBudTestDocument> {
    const create: CottonBudTestDocument = new this.cottonBudTestModel(
      createDto,
    );
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & cottonBudTest object
   * @return
   */
  async update(
    id: string,
    cottonBudTestData: Partial<CottonBudTest>,
  ): Promise<CottonBudTestDocument> {
    return await this.cottonBudTestModel
      .findByIdAndUpdate({ _id: id }, cottonBudTestData)
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
    return await this.cottonBudTestModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
