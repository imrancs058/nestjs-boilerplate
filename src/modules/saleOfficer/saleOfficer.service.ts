import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  saleOfficerJsonSchema,
  SaleOfficer,
  SaleOfficerDocument,
} from './saleOfficer.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { SaleOfficerDtoDto } from './dto/saleOfficerDto.dto';

@Injectable()
export class SaleOfficerService {
  constructor(
    @InjectModel(SaleOfficer.name)
    private saleOfficerModel: Model<SaleOfficer>,
  ) {}

  /**
   * get sale officer schema
   * @returns
   */
  async getSchema() {
    const saleOfficerSchema = await saleOfficerJsonSchema.SaleOfficer;
    saleOfficerSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: saleOfficerSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all saleOfficer
   * @param pageOptionsDto
   * @returns
   */

  async getSaleOfficer(pageOptionsDto: PageOptionsDto): Promise<SaleOfficer[]> {
    const queryBuilder = await this.saleOfficerModel
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
   * get single SaleOfficer
   * @param id
   * @returns
   */
  async findById(id: string): Promise<SaleOfficer[]> {
    const queryBuilder = await this.saleOfficerModel
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
  async create(createDto: SaleOfficer): Promise<SaleOfficerDocument> {
    const create: SaleOfficerDocument = new this.saleOfficerModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & saleOfficer object
   * @return
   */
  async update(
    id: string,
    saleOfficerData: SaleOfficerDtoDto,
  ): Promise<SaleOfficerDocument> {
    return await this.saleOfficerModel
      .findByIdAndUpdate({ _id: id }, saleOfficerData)
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
    return await this.saleOfficerModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
