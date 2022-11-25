import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CottonSampling,
  CottonSamplingDocument,
  cottonSamplingJsonSchema,
} from './cottonSampling.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { CategoryService } from '../category/category.service';
import { SupplierService } from '../supplier/supplier.service';
import { FarmAddressService } from '../farm_address/farm_address.service';

@Injectable()
export class CottonSamplingService {
  constructor(
    @InjectModel(CottonSampling.name)
    private CottonSamplingModel: Model<CottonSampling>,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private farmService: FarmAddressService,
  ) {}

  /**
   * get CottonSampling schema
   * @returns
   */
  async getSchema() {
    const CottonSamplingSchema = await cottonSamplingJsonSchema.CottonSampling;
    CottonSamplingSchema['properties']['_id'] = {
      type: 'string',
    };

    /**
     * Get Category Enum Data
     */
    const categoryData = await this.categoryService.CategorywithsubCategory();
    CottonSamplingSchema['properties']['subCategory']['type'] = 'string';
    CottonSamplingSchema['properties']['subCategory']['selectValue'] =
      categoryData;

    /**
     * Get Suppplier Enum data
     */
    const supplierData = await this.supplierService.getSupplier({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const supplierIdData = [];
    const supplierNameData = [];
    supplierData[0]['data'].forEach((element) => {
      supplierIdData.push(element._id);
      supplierNameData.push(element.firstName + ' ' + element.lastName);
    });
    CottonSamplingSchema['properties']['supplierId']['enum'] = supplierIdData;
    CottonSamplingSchema['properties']['supplierId']['enumNames'] =
      supplierNameData;
    // CottonSamplingSchema['properties']['supplierId']['type'] = 'string';
    // CottonSamplingSchema['properties']['supplierId']['selectValue'] = supplierData[0]['data'];

    /**
     * Get Farm Enum data
     */
    const farmData = await this.farmService.getFarm_Address({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const farmIdData = [];
    const farmNameData = [];
    farmData[0]['data'].forEach((element) => {
      farmIdData.push(element._id);
      farmNameData.push(element.address);
    });
    CottonSamplingSchema['properties']['farmId']['enum'] = farmIdData;
    CottonSamplingSchema['properties']['farmId']['enumNames'] = farmNameData;

    const customSchema = {
      schema: CottonSamplingSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        sampleNo: { 'ui:widget': 'hidden' },
        subCategory: { 'ui:widget': 'myCustomCategoryTypeAhead' },
        supplierId: { 'ui:widget': 'myCustomSelectTypeAhead' },
        farmId: { 'ui:widget': 'myCustomSelectTypeAhead' },
      },
    };
    return customSchema;
  }

  /**
   * get all CottonSampling
   * @param pageOptionsDto
   * @returns
   */

  async getCottonSampling(
    pageOptionsDto: PageOptionsDto,
  ): Promise<CottonSampling[]> {
    const queryBuilder = await this.CottonSamplingModel.aggregate([
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
    ]).catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
    return queryBuilder;
  }
  /**
   *
   * get single CottonSampling
   * @param id
   * @returns
   */
  async findById(id: string): Promise<CottonSampling[]> {
    const queryBuilder = await this.CottonSamplingModel.find({
      $and: [{ _id: id }, { isActive: true }],
    }).catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
    return queryBuilder;
  }

  /**
   * post
   * @param createDto
   * @returns
   */
  async create(createDto: CottonSampling): Promise<CottonSamplingDocument> {
    createDto['sampleNo'] = Math.floor(Math.random() * 1000 + 1);
    const create: CottonSamplingDocument = new this.CottonSamplingModel(
      createDto,
    );
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & CottonSampling object
   * @return
   */
  async update(
    id: string,
    cottonSamplingData: Partial<CottonSampling>,
  ): Promise<CottonSamplingDocument> {
    return await this.CottonSamplingModel.findByIdAndUpdate(
      { _id: id },
      cottonSamplingData,
    ).catch((err) => {
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
    return await this.CottonSamplingModel.updateOne(
      { _id: id },
      { isActive: false },
    ).catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }
}
