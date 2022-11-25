import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WheatPurity,
  WheatPurityDocument,
  wheatJsonSchema,
} from './wheatPurity.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';

@Injectable()
export class WheatPurityService {
  constructor(
    @InjectModel(WheatPurity.name)
    private wheatPurityModel: Model<WheatPurity>,
  ) {}

  /**
   * get wheat schema
   * @returns
   */
  async getSchema() {
    const wheatSchema = await wheatJsonSchema.WheatPurity;
    wheatSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: wheatSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        purchaseOrderId: { 'ui:widget': 'myCustomAsyncPurchaseTypeAhead' },
      },
    };
    return customSchema;
  }

  /**
   * get all wheatPurity
   * @param pageOptionsDto
   * @returns
   */

  async getWheatPurity(pageOptionsDto: PageOptionsDto): Promise<WheatPurity[]> {
    const queryBuilder = await this.wheatPurityModel
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
   * get single WheatPurity
   * @param id
   * @returns
   */
  async findById(id: string): Promise<WheatPurity[]> {
    const queryBuilder = await this.wheatPurityModel
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
  async create(createDto: WheatPurity): Promise<WheatPurityDocument> {
    const create: WheatPurityDocument = new this.wheatPurityModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & wheatPurity object
   * @return
   */
  async update(
    id: string,
    wheatPurityData: Partial<WheatPurity>,
  ): Promise<WheatPurityDocument> {
    return await this.wheatPurityModel
      .findByIdAndUpdate({ _id: id }, wheatPurityData)
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
    return await this.wheatPurityModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
