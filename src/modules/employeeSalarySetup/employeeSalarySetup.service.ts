import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  employeeSalarySetup,
  employeeSalarySetupDocument,
  employeeSalarySetupJsonSchema,
} from './employeeSalarySetup.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { employeeSalarySetupDtoDto } from './dto/employeeSalarySetupDto.dto';

@Injectable()
export class employeeSalarySetupService {
  constructor(
    @InjectModel(employeeSalarySetup.name)
    private employeeSalarySetupModel: Model<employeeSalarySetup>,
  ) {}

  /**
   * get employeeSalarySetup schema
   * @returns
   */
  async getSchema() {
    const employeeSalarySetupSchema =
      await employeeSalarySetupJsonSchema.employeeSalarySetup;
    employeeSalarySetupSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: employeeSalarySetupSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all employeeSalarySetup
   * @param pageOptionsDto
   * @returns
   */

  async getemployeeSalarySetup(
    pageOptionsDto: PageOptionsDto,
  ): Promise<employeeSalarySetup[]> {
    const queryBuilder = await this.employeeSalarySetupModel
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
   * get single employeeSalarySetup
   * @param id
   * @returns
   */
  async findById(id: string): Promise<employeeSalarySetup[]> {
    const queryBuilder = await this.employeeSalarySetupModel
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
  async create(
    createDto: employeeSalarySetup,
  ): Promise<employeeSalarySetupDocument> {
    const create: employeeSalarySetupDocument =
      new this.employeeSalarySetupModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & employeeSalarySetup object
   * @return
   */
  async update(
    id: string,
    employeeSalarySetupData: employeeSalarySetupDtoDto,
  ): Promise<employeeSalarySetupDocument> {
    return await this.employeeSalarySetupModel
      .findByIdAndUpdate({ _id: id }, employeeSalarySetupData)
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
    return await this.employeeSalarySetupModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
