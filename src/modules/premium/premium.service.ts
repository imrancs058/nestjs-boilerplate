import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import { premiumJsonSchema, Premium, PremiumDocument } from './premium.schema';

@Injectable()
export class PremiumService {
  constructor(
    @InjectModel(Premium.name)
    private premiumModel: Model<PremiumDocument>,
  ) {}

  /**
   * get premium schema
   * @returns
   */
  async getSchema() {
    const premiumSchema = await premiumJsonSchema.Premium;
    premiumSchema['properties']['_id'] = {
      type: 'string',
    };
    premiumSchema['properties']['endDate'] = {
      format: 'date',
      type: 'string',
      title: 'End Date',
    };
    premiumSchema['properties']['startDate'] = {
      format: 'date',
      type: 'string',
      title: 'Start Date',
    };

    const customSchema = {
      schema: premiumSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        // startDate: { 'ui:widget': 'myDatePickerBootstrap' },
        // endDate: { 'ui:widget': 'myDatePickerBootstrap' },
      },
    };
    return customSchema;
  }

  /**
   * get all premium
   * @param pageOptionsDto
   * @returns
   */

  async getPremium(pageOptionsDto: PageOptionsDto): Promise<Premium[]> {
    const schemaData = await premiumJsonSchema.Premium;
    const schemaKeys = Object.keys(schemaData.properties);
    const searchData = [];
    if (pageOptionsDto.q == '') {
      searchData.push({});
    } else {
      schemaKeys.map((element) => {
        const obj = {};
        obj[element] = { $regex: new RegExp(pageOptionsDto.q, 'i') };
        return searchData.push(obj);
      });
    }
    const queryBuilder = await this.premiumModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            value: 1,
            isActive: 1,

            startDate: {
              $dateToString: { format: '%Y-%m-%d', date: '$startDate' },
            },
            endDate: {
              $dateToString: { format: '%Y-%m-%d', date: '$endDate' },
            },
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
          },
        },
        {
          $match: {
            $or: searchData,
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
   * get single premium
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Premium[]> {
    const queryBuilder = await this.premiumModel
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
  async create(createDto: Partial<Premium>): Promise<PremiumDocument> {
    const create: PremiumDocument = new this.premiumModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }
  async getPremiumById(id: any): Promise<any> {
    const premiumData = await this.premiumModel
      .findById({ _id: id })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return premiumData;
  }

  /**
   *
   * patch
   * @param id & premiumData object
   * @return
   */
  async update(
    id: string,
    premiumData: Partial<Premium>,
  ): Promise<PremiumDocument> {
    return await this.premiumModel
      .findByIdAndUpdate({ _id: id }, premiumData)
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
    return await this.premiumModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
