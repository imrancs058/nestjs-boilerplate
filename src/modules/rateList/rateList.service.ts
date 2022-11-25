/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { rateListJsonSchema,RateList, RateListDocument } from './rateList.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { RateListDtoDto } from './dto/rateListDto.dto';

@Injectable()
export class RateListService {
  constructor(
    @InjectModel(RateList.name)
    private rateListModel: Model<RateList>,
  ) {}

    /**
   * get rate List schema
   * @returns
   */
     async getSchema(){
      const rateListSchema= await rateListJsonSchema.RateList;
      rateListSchema['properties']['_id'] = {
        type: 'string',
      };
      const customSchema = {
        schema: rateListSchema,
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

  async getRateList(pageOptionsDto: PageOptionsDto): Promise<RateList[]> {
    const queryBuilder = await this.rateListModel
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
   * get single RateList
   * @param id
   * @returns
   */
  async findById(id: string): Promise<RateList[]> {
    const queryBuilder = await this.rateListModel
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
  async create(createDto: RateList): Promise<RateListDocument> {
    const create: RateListDocument = new this.rateListModel(createDto);
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
    rateListData: RateListDtoDto,
  ): Promise<RateListDocument> {
    return await this.rateListModel
      .findByIdAndUpdate({ _id: id }, rateListData)
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
    return await this.rateListModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
