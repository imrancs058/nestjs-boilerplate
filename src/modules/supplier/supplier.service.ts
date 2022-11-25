/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  supplierJsonSchema,
  Supplier,
  SupplierDocument,
} from './supplier.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import { FarmAddressService } from '../farm_address/farm_address.service';
@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
    private readonly farmAddressService: FarmAddressService,
  ) {}

  /**
   * get supplier schema
   * @returns
   */
  async getSchema() {
    const customStruct = await supplierJsonSchema.Supplier;
    customStruct['properties']['_id'] = {
      type: 'string',
    };

    const farmSchema = await this.farmAddressService.getSchema();
    delete farmSchema.schema['properties']['supplierId'];
    farmSchema.schema['properties']['supplierId'] = {
      type: 'string',
    };

    customStruct.properties.farmSchema = {
      type: 'array',
      title: 'Farm Address',
      items: farmSchema.schema,
    };

    const customSchema = {
      schema: customStruct,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        farmSchema: {
          items: {
            _id: { 'ui:widget': 'hidden' },
            supplierId: { 'ui:widget': 'hidden' },
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
   * get all supplier
   * @param pageOptionsDto
   * @returns
   */

  async getSupplier(pageOptionsDto: PageOptionsDto): Promise<Supplier[]> {
    const schemaData = await supplierJsonSchema.Supplier;
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
    const queryBuilder = await this.supplierModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'farm_addresses',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$supplierId', '$$id'] },
                      { $eq: ['$isActive', true] },
                    ],
                  },
                },
              },
            ],
            as: 'farmSchema',
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
   * get all suppliers with coa
   * @param pageOptionsDto
   * @returns
   */

  /**
   *
   * get single supplier
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Supplier[]> {
    const queryBuilder = await this.supplierModel
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
  async create(createDto: Supplier): Promise<any> {
    const create: SupplierDocument = new this.supplierModel(createDto);
    const supp = await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
    if (createDto.hasOwnProperty('farmSchema')) {
      const farmData = createDto['farmSchema'];
      for (let i = 0; i < farmData.length; i++) {
        farmData[i]['supplierId'] = supp._id;
      }
      await this.farmAddressService.create(farmData);
    }
    return supp;
  }

  /**
   *
   * patch
   * @param id & supplierData object
   * @return
   */
  async update(
    id: string,
    supplierData: Partial<Supplier>,
  ): Promise<SupplierDocument> {
    if (supplierData.hasOwnProperty('farmSchema')) {
      const farmData = supplierData['farmSchema'];
      for (let i = 0; i < farmData.length; i++) {
        farmData[i]['supplierId'] = id;
        await this.farmAddressService.update(farmData[i]['_id'], farmData[i]);
      }
    }
    return await this.supplierModel
      .findByIdAndUpdate({ _id: id }, supplierData)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  /**
   *
   * delete
   * @param id & supplierData object
   * @return
   */
  async delete(id: string): Promise<any> {
    await this.supplierModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    await this.farmAddressService.deleteMany(id);
    return;
  }
}
