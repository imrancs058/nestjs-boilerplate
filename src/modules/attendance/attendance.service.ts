/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { attendanceJsonSchema, attendance, attendanceDocument } from './attendance.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { attendanceDtoDto } from './dto/attendance.dto';

@Injectable()
export class attendanceService {
  constructor(
    @InjectModel(attendance.name)
    private attendanceModel: Model<attendance>,
  ) {}

    /**
   * get rate List schema
   * @returns
   */
     async getSchema(){
      const attendanceSchema = await attendanceJsonSchema;
      attendanceSchema['properties']['_id'] = {
        type: 'string',
      };
      const customSchema = {
        schema: attendanceSchema,
        uischema: {
          _id: { 'ui:widget': 'hidden' },
        },
      };
      return customSchema;
    }


  /**
   * get all attendance
   * @param pageOptionsDto
   * @returns
   */

  async getattendance(pageOptionsDto: PageOptionsDto): Promise<attendance[]> {
    const queryBuilder = await this.attendanceModel
      .aggregate([
        {
          $match: {
            isActive: true,
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
   * get single attendance
   * @param id
   * @returns
   */
  async findById(id: string): Promise<attendance[]> {
    const queryBuilder = await this.attendanceModel
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
  async create(createDto: attendance): Promise<attendanceDocument> {
    const create: attendanceDocument = new this.attendanceModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & attendance object
   * @return
   */
  async update(
    id: string,
    attendanceData: attendanceDtoDto,
  ): Promise<attendanceDocument> {
    return await this.attendanceModel
      .findByIdAndUpdate({ _id: id }, attendanceData)
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
    return await this.attendanceModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
