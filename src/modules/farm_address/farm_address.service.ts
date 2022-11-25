import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Farm_AddressJsonSchema,
  Farm_Address,
  Farm_AddressDocument,
} from './farm_address.schema';

import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import { Farm_AddressDto } from './dto/farm_address.dto';

@Injectable()
export class FarmAddressService {
  constructor(
    @InjectModel(Farm_Address.name)
    private farm_AddressModel: Model<Farm_AddressDocument>,
  ) {}

  /**
   * get farm_address schema
   * @returns
   */
  async getSchema() {
    const farmSchema = Farm_AddressJsonSchema.Farm_Address;
    farmSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: farmSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all farm_address
   * @param pageOptionsDto
   * @returns
   */

  async getFarm_Address(
    pageOptionsDto: PageOptionsDto,
  ): Promise<Farm_Address[]> {
    const queryBuilder = await this.farm_AddressModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'carriage_rates',
            localField: '_id',
            foreignField: 'farmAddressId',
            as: 'farm_addressData',
          },
        },
        {
          $unwind: {
            path: '$farm_addressData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            tehsil: 1,
            district: 1,
            address: 1,
            farmAddressId: { $ifNull: ['$farm_addressData.farmAddressId', ''] },
            rate: { $ifNull: ['$farm_addressData.rate', ''] },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            isActive: 1,
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
   * get single farm_address
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Farm_Address[]> {
    const queryBuilder = await this.farm_AddressModel
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
  async create(createDto: Farm_Address[]): Promise<Farm_AddressDocument> {
    const create: any = await this.farm_AddressModel
      .insertMany(createDto)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return create;
  }

  /**
   *
   * patch
   * @param id & farm_AddressData object
   * @return
   */
  async update(
    id: string,
    farm_AddressData: Farm_AddressDto,
  ): Promise<Farm_AddressDocument> {
    return await this.farm_AddressModel
      .findByIdAndUpdate({ _id: id }, farm_AddressData)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  /**
   *
   * delete
   * @param id & farm_AddressData object
   * @return
   */
  async delete(id: string): Promise<any> {
    return await this.farm_AddressModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
   *
   * delete
   * @param id & farm_AddressData object
   * @return
   */
  async deleteMany(id: string): Promise<any> {
    return await this.farm_AddressModel
      .updateMany({ supplierId: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
