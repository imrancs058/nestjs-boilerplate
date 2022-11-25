import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  employee,
  employeeDocument,
  employeeJsonSchema,
} from './employee.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { employeeDtoDto } from './dto/employeeDto.dto';
import { designationService } from '../designation/designation.service';

@Injectable()
export class employeeService {
  constructor(
    @InjectModel(employee.name)
    private employeeModel: Model<employee>,
    private designationService: designationService,
  ) {}

  /**
   * get employee schema
   * @returns
   */
  async getSchema() {
    const employeeSchema = await employeeJsonSchema.employee;
    employeeSchema['properties']['_id'] = {
      type: 'string',
    };

    /**
     * Get Designation Enum data
     */
    const designationData = await this.designationService.getdesignation({
      column: '_id',
      order: -1,
      take: 1000,
      skip: 0,
    });
    const designationIdData = [];
    const designationNameData = [];
    designationData[0]['data'].forEach((element) => {
      designationIdData.push(element._id);
      designationNameData.push(element.name);
    });
    employeeSchema['properties']['designationId']['enum'] = designationIdData;
    employeeSchema['properties']['designationId']['enumNames'] =
      designationNameData;
    employeeSchema['properties']['designation'] = {
      type: 'string',
      title: 'Designation',
    };
    const customSchema = {
      schema: employeeSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        designation: { 'ui:widget': 'hidden' },
        joinDate: { 'ui:widget': 'date' },
        terminationDate: { 'ui:widget': 'date' },
        designationId: { 'ui:widget': 'myCustomSelectTypeAhead' },
      },
    };
    return customSchema;
  }

  /**
   * get all employee
   * @param pageOptionsDto
   * @returns
   */

  async getemployee(pageOptionsDto: PageOptionsDto): Promise<employee[]> {
    const queryBuilder = await this.employeeModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'designations',
            localField: 'designationId',
            foreignField: '_id',
            as: 'designation',
          },
        },
        {
          $unwind: {
            path: '$designation',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            fname: 1,
            lname: 1,
            cnic: 1,
            phone: 1,
            salary: 1,
            email: 1,
            address: 1,
            designation: '$designation.name',
            joinDate: 1,
            terminationDate: 1,
            isActive: 1,
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
   * get single employee
   * @param id
   * @returns
   */
  async findById(id: string): Promise<employee[]> {
    const queryBuilder = await this.employeeModel
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
  async create(createDto: employee): Promise<employeeDocument> {
    const create: employeeDocument = new this.employeeModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & employee object
   * @return
   */
  async update(
    id: string,
    employeeData: employeeDtoDto,
  ): Promise<employeeDocument> {
    return await this.employeeModel
      .findByIdAndUpdate({ _id: id }, employeeData)
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
    return await this.employeeModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
