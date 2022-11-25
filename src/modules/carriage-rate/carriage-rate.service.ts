import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseCode } from '../../exceptions/index';
import {
  carriage_RateJsonSchema,
  Carriage_Rate,
  Carriage_RateDocument,
} from './carriage-rate.schema';

@Injectable()
export class CarriageRateService {
  constructor(
    @InjectModel(Carriage_Rate.name)
    private carriage_rateModel: Model<Carriage_RateDocument>,
  ) {}

  /**
   * get carriage_Rate schema
   * @returns
   */
  async getSchema() {
    return await carriage_RateJsonSchema.Category;
  }
  /**
   *
   * get single carriage rate
   * @param
   * id
   * @returns
   */
  async findById(id: string): Promise<any> {
    const queryBuilder = await this.carriage_rateModel
      .aggregate([
        {
          $match: {
            isActive: true,
            _id: new Types.ObjectId(id),
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
          $lookup: {
            from: 'farm_addresses',
            localField: 'farmAddressId',
            foreignField: '_id',
            as: 'farm_Address_doc',
          },
        },
        {
          $unwind: {
            path: '$farm_Address_doc',
            preserveNullAndEmptyArrays: true,
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
  async create(createDto: Carriage_Rate): Promise<Carriage_RateDocument> {
    const create: Carriage_RateDocument = new this.carriage_rateModel(
      createDto,
    );
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }
  /**
   *
   * patch
   * @param id & carriageRateData object
   * @return
   */
  async update(
    id: string,
    carriageRateData: Carriage_Rate,
  ): Promise<Carriage_RateDocument> {
    return await this.carriage_rateModel
      .findByIdAndUpdate({ _id: id }, carriageRateData)
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
    return await this.carriage_rateModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
