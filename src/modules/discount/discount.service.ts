/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { discountJsonSchema, Discount, DiscountDocument } from './discount.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { DiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name)
    private discountModel: Model<Discount>,
  ) {}

    /**
   * get Discount schema
   * @returns
   */
     async getSchema(){
      const discountSchema= await discountJsonSchema.Discount;
      discountSchema['properties']['_id'] = {
        type: 'string',
      };
      const customSchema = {
        schema: discountSchema,
        uischema: {
          _id: { 'ui:widget': 'hidden' },
        },
      };
      return customSchema;
    }


  /**
   * get all rateList
   * @param pageOptionsDto
   * @returns
   */

  async getDiscount(pageOptionsDto: PageOptionsDto): Promise<Discount[]> {
    const queryBuilder = await this.discountModel
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
   * get single Discount
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Discount[]> {
    const queryBuilder = await this.discountModel
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
  async create(createDto: Discount): Promise<DiscountDocument> {
    const create: DiscountDocument = new this.discountModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & rateList object
   * @return
   */
  async update(
    id: string,
    discountData: DiscountDto,
  ): Promise<DiscountDocument> {
    return await this.discountModel
      .findByIdAndUpdate({ _id: id }, discountData)
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
    return await this.discountModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
