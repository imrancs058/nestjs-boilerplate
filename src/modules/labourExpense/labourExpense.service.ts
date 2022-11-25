/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LabourExpenseJsonSchema,
  LabourExpense,
  LabourExpenseDocument,
} from './labourExpense.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { LabourTypeService } from '../labourType/labourType.service';
import { ContractorService } from '../contractor/contractor.service';
import mongoose from 'mongoose';
@Injectable()
export class LabourExpenseService {
  constructor(
    @InjectModel(LabourExpense.name)
    private labourExpenseModel: Model<LabourExpense>,
    private labourTypeService: LabourTypeService,
    private contractorService: ContractorService,
  ) {}

  /**
   * get labourExpense schema
   * @returns
   */
  async getSchema() {
    let labourExpenseSchemaObj = {};
    const labourExpenseSchema = await LabourExpenseJsonSchema.LabourExpense;
    labourExpenseSchema['properties']['_id'] = {
      type: 'string',
    };
    const labourTypeList = await this.labourTypeService.getlabourType({
      order: 1,
      column: '_id',
      take: 1000,
      skip: 0,
    });
    const enumList = [];
    const enumName = [];
    labourTypeList[0]['data'].forEach((item) => {
      enumList.push(item._id);
      enumName.push(item.name);
    });
    labourExpenseSchema.properties.typeId['enum'] = enumList;
    labourExpenseSchema.properties.typeId['enumNames'] = enumName;

    // get contractor rates
    const contractorList = await this.contractorService.getContractorAndRates();
    const contif = [];
    const contractorListEnum = ['self'];
    const contractorListEnumName = ['Self'];
    contractorList.forEach((item) => {
      const contEnum = [];
      const contEnumName = [];
      contractorListEnum.push(item['_id']);
      contractorListEnumName.push(`${item['firstName']} ${item['lastName']}`);
      item['childrens'].forEach((val) => {
        contEnum.push(val._id);
        contEnumName.push(val.rate);
      });

      contif.push({
        if: {
          properties: {
            contractorID: {
              const: item['_id'],
            },
          },
        },
        then: {
          properties: {
            contractorRateID: {
              type: 'string',
              enum: contEnum.length == 0 ? [''] : contEnum,
              enumNames: contEnumName.length == 0 ? [''] : contEnumName,
            },
          },
          required: ['contractorRateID'],
        },
      });
    });
    //labourExpenseSchema['properties']['categoryId']['type'] = 'string';
    labourExpenseSchemaObj = {
      properties: {
        contractorID: {
          enum: contractorListEnum,
          enumNames: contractorListEnumName,
        },
        contractorRateID: labourExpenseSchema.properties.contractorRateID,
        typeId: labourExpenseSchema.properties.typeId,
      },
    };
    labourExpenseSchemaObj['allOf'] = contif;
    labourExpenseSchemaObj['required'] = labourExpenseSchema.required;
    //labourExpenseSchemaObj['required'].push('contractor');
    labourExpenseSchemaObj['properties']._id = {
      type: 'string',
    };

    const customSchema = {
      schema: labourExpenseSchemaObj,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all labourExpense
   * @param pageOptionsDto
   * @returns
   */

  async getlabourExpense(
    pageOptionsDto: PageOptionsDto,
  ): Promise<LabourExpense[]> {
    const queryBuilder = await this.labourExpenseModel
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
   * get all labourExpense
   * @param pageOptionsDto
   * @returns
   */

  async getlabourExpenseByFK(id: string): Promise<LabourExpense[]> {
    const queryBuilder = await this.labourExpenseModel
      .aggregate([
        {
          $match: {
            isActive: true,
            assetId: new mongoose.Types.ObjectId(id),
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
   * get single labourExpense
   * @param id
   * @returns
   */
  async findById(id: string): Promise<LabourExpense[]> {
    const queryBuilder = await this.labourExpenseModel
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
  async create(createDto: any): Promise<LabourExpenseDocument> {
    const create: any = await this.labourExpenseModel
      .insertMany(createDto)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return create;
    // const create: LabourExpenseDocument = new this.labourExpenseModel(
    //   createDto,
    // );
    // return await create.save().catch((err) => {
    //   throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    // });
  }

  /**
   * post
   * @param createDto
   * @returns
   */
  async createByProduction(
    createDto: LabourExpense[],
    Id: object | string,
  ): Promise<LabourExpenseDocument[]> {
    const records = [];
    for (let i = 0; i < createDto.length; i++) {
      const obj: any = {
        contractorRateID: createDto[i]['contractorRateID'],
        assetId: Id,
        typeId: createDto[i]['typeId'],
        contractorID: createDto[i]['contractorID'],
      };

      records.push(obj);
    }
    await this.create(records).catch((err) => {
      console.log(err);
    });
    return records;
  }

  /**
   *
   * patch
   * @param id & labourExpense object
   * @return
   */
  async update(
    id: string,
    labourExpenseData: LabourExpense,
  ): Promise<LabourExpenseDocument> {
    return await this.labourExpenseModel
      .findByIdAndUpdate({ _id: id }, labourExpenseData, { upsert: true })
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
    return await this.labourExpenseModel
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
    return await this.labourExpenseModel
      .updateMany({ assetId: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
