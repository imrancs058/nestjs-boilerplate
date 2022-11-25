import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Contractor,
  ContractorDocument,
  contractorJsonSchema,
} from './contractor.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import { ContractorRateService } from '../contractor_rate/contractor_rate.service';
import { FarmAddressService } from '../farm_address/farm_address.service';
@Injectable()
export class ContractorService {
  constructor(
    @InjectModel(Contractor.name)
    private contractorModel: Model<ContractorDocument>,
    private contractorRateService: ContractorRateService,
    private farmAddressService: FarmAddressService,
  ) {}

  /**
   * get contractor schema
   * @returns
   */
  async getSchema() {
    const contractorSchema = await contractorJsonSchema.Contractor;
    contractorSchema['properties']['_id'] = {
      type: 'string',
    };
    const supervisors = await this.getSupervisor();
    const enumVal = [];
    const enumName = [];
    if (supervisors.length > 0) {
      supervisors.forEach((item) => {
        enumVal.push(item['_id']);
        enumName.push(`${item['firstName']} ${item['lastName']}`);
      });
    } else {
      enumVal.push('');
      enumName.push('N/A');
    }
    contractorSchema['properties']['supervisorId']['enum'] = enumVal;
    contractorSchema['properties']['supervisorId']['enumNames'] = enumName;

    const contractorRateSchema = await this.contractorRateService.getSchema();
    delete contractorRateSchema.schema['properties']['contractorId'];
    contractorRateSchema.schema['properties']['contractorId'] = {
      type: 'string',
    };

    /**
     * Get Farm Address Enum data
     */
    const farmAddressData = await this.farmAddressService.getFarm_Address({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const farmAddressIdData = [];
    const farmAddressNameData = [];
    farmAddressData[0]['data'].forEach((element) => {
      farmAddressIdData.push(element._id);
      farmAddressNameData.push(element.address);
    });
    contractorRateSchema.schema['properties']['farmAddressId']['enum'] =
      farmAddressIdData;
    contractorRateSchema.schema['properties']['farmAddressId']['enumNames'] =
      farmAddressNameData;

    contractorSchema.properties.contractorRateSchema = {
      type: 'array',
      title: 'Contractor Rate',
      items: contractorRateSchema.schema,
    };
    const customSchema = {
      schema: contractorSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        supervisorId: { 'ui:widget': 'myCustomSelectTypeAhead' },
        contractorRateSchema: {
          items: {
            _id: { 'ui:widget': 'hidden' },
            contractorId: { 'ui:widget': 'hidden' },
            farmAddressId: { 'ui:widget': 'myCustomSelectTypeAhead' },
            // packingSize: { 'ui:widget': 'myCustomSelectTypeAhead' },
          },
          'ui:options': {
            orderable: false,
          },
        },
      },
    };
    return customSchema;
  }

  /**
   * get all Supervisor
   * @returns
   */

  async getSupervisor(): Promise<Contractor[]> {
    const queryBuilder = await this.contractorModel
      .aggregate([
        {
          $match: {
            isActive: true,
            supervisorId: null,
          },
        },
        {
          $addFields: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  /**
   * get all Supervisor
   * @returns
   */

  async getDriver(): Promise<Contractor[]> {
    const queryBuilder = await this.contractorModel
      .aggregate([
        {
          $match: {
            $and: [{ isActive: true }, { vehicalNumber: { $ne: null } }],
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  /**
   * get contractor with contractor rates
   * @returns
   */

  async getContractorAndRates(): Promise<Contractor[]> {
    const queryBuilder = await this.contractorModel
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
          $lookup: {
            from: 'contractor_rates',
            localField: '_id',
            foreignField: 'contractorId',
            as: 'childrens',
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  /**
   * get all contractor
   * @param pageOptionsDto
   * @returns
   */

  async getContractor(pageOptionsDto: PageOptionsDto): Promise<Contractor[]> {
    const schemaData = await contractorJsonSchema.Contractor;
    const schemaKeys = Object.keys(schemaData.properties);
    const searchData = [];
    if (pageOptionsDto.q == '') {
      searchData.push({});
    } else {
      schemaKeys.map((element) => {
        const obj = {};
        obj[element] = { $regex: new RegExp(pageOptionsDto.q, 'i') };
        return searchData.push(obj);
      });
    }
    const queryBuilder = await this.contractorModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'contractor_rates',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$contractorId', '$$id'] },
                      { $eq: ['$isActive', true] },
                    ],
                  },
                },
              },
            ],
            as: 'contractorRateSchema',
          },
        },
        {
          $graphLookup: {
            from: 'contractors',
            startWith: '$supervisorId',
            connectFromField: 'supervisorId',
            connectToField: '_id',
            maxDepth: 0,
            as: 'supervisors',
            restrictSearchWithMatch: { isActive: true },
          },
        },
        {
          $unwind: {
            path: '$supervisors',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            supervisorId: {
              $ifNull: ['$supervisors._id', ''],
            },
            supervisor: {
              $concat: ['$supervisors.firstName', ' ', '$supervisors.lastName'],
            },
            firstName: 1,
            lastName: 1,
            address: 1,
            cnic: 1,
            phone: 1,
            vehicalNumber: 1,
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            isActive: 1,
            contractorRateSchema: 1,
          },
        },
        {
          $match: {
            $or: searchData,
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
   * get single contractor
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Contractor[]> {
    const queryBuilder = await this.contractorModel
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
  async create(createDto: Contractor): Promise<ContractorDocument> {
    const create: ContractorDocument = new this.contractorModel(createDto);
    const record = await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });

    if (createDto.hasOwnProperty('contractorRateSchema')) {
      const contractorRateData = createDto['contractorRateSchema'];
      for (let i = 0; i < contractorRateData.length; i++) {
        contractorRateData[i]['contractorId'] = record._id;
        await this.contractorRateService.create(contractorRateData[i]);
      }
    }
    return record;
  }

  /**
   *
   * put
   * @param id & contractorData object
   * @return
   */
  async update(
    id: string,
    contractorData: Partial<Contractor>,
  ): Promise<ContractorDocument> {
    if (contractorData.hasOwnProperty('contractorRateSchema')) {
      const contractorRateData = contractorData['contractorRateSchema'];
      for (let i = 0; i < contractorRateData.length; i++) {
        contractorRateData[i]['contractorId'] = id;
        await this.contractorRateService.update(
          contractorRateData[i]['_id'],
          contractorRateData[i],
        );
      }
    }
    return await this.contractorModel
      .findByIdAndUpdate({ _id: id }, contractorData)
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
    await this.contractorModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    await this.contractorRateService.deleteMany(id);
    return;
  }
}
