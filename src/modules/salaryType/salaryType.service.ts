import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  salaryTypeJsonSchema,
  salaryType,
  salaryTypeDocument,
} from './salaryType.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { salaryTypeDto } from './dto/salaryType.dto';

@Injectable()
export class salaryTypeService {
  constructor(
    @InjectModel(salaryType.name)
    private salaryTypeModel: Model<salaryType>,
  ) {}

  /**
   * get salaryType schema
   * @returns
   */
  async getSchema() {
    return await salaryTypeJsonSchema.Category;
  }

  /**
   * get all salaryType
   * @param pageOptionsDto
   * @returns
   */

  async getsalaryType(pageOptionsDto: PageOptionsDto): Promise<salaryType[]> {
    const queryBuilder = await this.salaryTypeModel
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
   * get single salaryType
   * @param id
   * @returns
   */
  async findById(id: string): Promise<salaryType[]> {
    const queryBuilder = await this.salaryTypeModel
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
  async create(createDto: salaryType): Promise<salaryTypeDocument> {
    const create: salaryTypeDocument = new this.salaryTypeModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & salaryType object
   * @return
   */
  async update(
    id: string,
    salaryTypeData: salaryTypeDto,
  ): Promise<salaryTypeDocument> {
    return await this.salaryTypeModel
      .findByIdAndUpdate({ _id: id }, salaryTypeData)
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
    return await this.salaryTypeModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
