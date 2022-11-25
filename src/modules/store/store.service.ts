import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Store, StoreDocument, storeJsonSchema } from './store.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { StoreDto } from './dto/store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name)
    private storeModel: Model<Store>,
  ) {}

  /**
   * get Store schema
   * @returns
   */
  async getSchema() {
    const storeSchema = await storeJsonSchema.Store;
    const customSchema = { schema: storeSchema, uischema: {} };

    return customSchema;
  }

  /**
   * get all store
   * @param pageOptionsDto
   * @returns
   */

  async getStore(pageOptionsDto: PageOptionsDto): Promise<Store[]> {
    const queryBuilder = await this.storeModel
      .aggregate([
        {
          $match: {
            $and: [{ isActive: true }, { storeId: null }],
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
   * get all chatha
   * @param pageOptionsDto
   * @returns
   */

  async getChatha(pageOptionsDto: PageOptionsDto): Promise<Store[]> {
    const queryBuilder = await this.storeModel
      .aggregate([
        {
          $match: {
            $and: [{ isActive: true }, { storeId: { $ne: null } }],
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
   * get mutiple Store
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Store[]> {
    const queryBuilder = await this.storeModel
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
  async create(createDto: StoreDto): Promise<StoreDocument> {
    const create: StoreDocument = new this.storeModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & store object
   * @return
   */
  async update(id: string, storeData: StoreDto): Promise<StoreDocument> {
    return await this.storeModel
      .findByIdAndUpdate({ _id: id }, storeData)
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
    return await this.storeModel
      .updateOne({ _id: id }, { isActive: false })
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
  async deleteMany(id: string): Promise<any> {
    return await this.storeModel
      .updateMany({ warehouseId: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
