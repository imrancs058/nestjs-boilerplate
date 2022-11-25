import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  salaryGenerate,
  salaryGenerateDocument,
  salaryGenerateJsonSchema,
} from './salaryGenerate.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { salaryGenerateDto } from './dto/salaryGenerate.dto';

@Injectable()
export class salaryGenerateService {
  constructor(
    @InjectModel(salaryGenerate.name)
    private salaryGenerateModel: Model<salaryGenerate>,
  ) {}

  /**
   * get salaryGenerate schema
   * @returns
   */
  async getSchema() {
    return await salaryGenerateJsonSchema.Category;
  }

  /**
   * get all salaryGenerate
   * @param pageOptionsDto
   * @returns
   */

  async getsalaryGenerate(
    pageOptionsDto: PageOptionsDto,
  ): Promise<salaryGenerate[]> {
    const queryBuilder = await this.salaryGenerateModel
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
   * get single salaryGenerate
   * @param id
   * @returns
   */
  async findById(id: string): Promise<salaryGenerate[]> {
    const queryBuilder = await this.salaryGenerateModel
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
  async create(createDto: salaryGenerateDto): Promise<salaryGenerateDocument> {
    const create: salaryGenerateDocument = new this.salaryGenerateModel(
      createDto,
    );
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & salaryGenerate object
   * @return
   */
  async update(
    id: string,
    salaryGenerateData: salaryGenerateDto,
  ): Promise<salaryGenerateDocument> {
    return await this.salaryGenerateModel
      .findByIdAndUpdate({ _id: id }, salaryGenerateData)
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
    return await this.salaryGenerateModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
