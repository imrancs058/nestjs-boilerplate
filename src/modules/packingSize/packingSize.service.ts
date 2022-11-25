import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  packingJsonSchema,
  PackingSize,
  PackingSizeDocument,
} from './packingSize.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { PackingSizeDtoDto } from './dto/packingSizeDto.dto';

@Injectable()
export class PackingSizeService {
  constructor(
    @InjectModel(PackingSize.name)
    private packingSizeModel: Model<PackingSize>,
  ) {}

  /**
   * get packing size schema
   * @returns
   */
  async getSchema() {
    const packingSizeSchema = await packingJsonSchema.PackingSize;
    packingSizeSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: packingSizeSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all packing size
   * @param pageOptionsDto
   * @returns
   */

  async getPackingSize(pageOptionsDto: PageOptionsDto): Promise<PackingSize[]> {
    const queryBuilder = await this.packingSizeModel
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
   * get single PackingSize
   * @param id
   * @returns
   */
  async findById(id: string): Promise<PackingSize[]> {
    const queryBuilder = await this.packingSizeModel
      .find({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }
  async findOneById(id: string): Promise<PackingSize> {
    const queryBuilder = await this.packingSizeModel
      .findOne({ $and: [{ _id: id }, { isActive: true }] })
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
  async create(createDto: PackingSize): Promise<PackingSizeDocument> {
    const create: PackingSizeDocument = new this.packingSizeModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & packing size object
   * @return
   */
  async update(
    id: string,
    packingSizeData: PackingSizeDtoDto,
  ): Promise<PackingSizeDocument> {
    return await this.packingSizeModel
      .findByIdAndUpdate({ _id: id }, packingSizeData)
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
    return await this.packingSizeModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
