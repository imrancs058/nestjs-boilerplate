import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WheatSampling,
  WheatSamplingDocument,
  wheatSamplingJsonSchema,
} from './wheatSampling.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { CategoryService } from '../category/category.service';
import { SupplierService } from '../supplier/supplier.service';
import { FarmAddressService } from '../farm_address/farm_address.service';

@Injectable()
export class WheatSamplingService {
  constructor(
    @InjectModel(WheatSampling.name)
    private WheatSamplingModel: Model<WheatSampling>,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private farmService: FarmAddressService,
  ) {}

  /**
   * get wheat schema
   * @returns
   */
  async getSchema() {
    const WheatSamplingSchema = await wheatSamplingJsonSchema.WheatSampling;
    WheatSamplingSchema['properties']['_id'] = {
      type: 'string',
    };

    /**
     * Get Category Enum Data
     */
    const categoryData = await this.categoryService.CategorywithsubCategory();
    WheatSamplingSchema['properties']['subCategory']['type'] = 'string';
    WheatSamplingSchema['properties']['subCategory']['selectValue'] =
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
    WheatSamplingSchema['properties']['supplierId']['enum'] = supplierIdData;
    WheatSamplingSchema['properties']['supplierId']['enumNames'] =
      supplierNameData;
    // WheatSamplingSchema['properties']['supplierId']['type'] = 'string';
    // WheatSamplingSchema['properties']['supplierId']['selectValue'] = supplierData[0]['data'];

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
    WheatSamplingSchema['properties']['farmId']['enum'] = farmIdData;
    WheatSamplingSchema['properties']['farmId']['enumNames'] = farmNameData;

    const customSchema = {
      schema: WheatSamplingSchema,
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
   * get all WheatSampling
   * @param pageOptionsDto
   * @returns
   */

  async getWheatSampling(
    pageOptionsDto: PageOptionsDto,
  ): Promise<WheatSampling[]> {
    const queryBuilder = await this.WheatSamplingModel.aggregate([
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
   * get single WheatSampling
   * @param id
   * @returns
   */
  async findById(id: string): Promise<WheatSampling[]> {
    const queryBuilder = await this.WheatSamplingModel.find({
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
  async create(createDto: WheatSampling): Promise<WheatSamplingDocument> {
    createDto['sampleNo'] = Math.floor(Math.random() * 1000 + 1);
    const create: WheatSamplingDocument = new this.WheatSamplingModel(
      createDto,
    );
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & WheatSampling object
   * @return
   */
  async update(
    id: string,
    wheatSamplingData: Partial<WheatSampling>,
  ): Promise<WheatSamplingDocument> {
    return await this.WheatSamplingModel.findByIdAndUpdate(
      { _id: id },
      wheatSamplingData,
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
    return await this.WheatSamplingModel.updateOne(
      { _id: id },
      { isActive: false },
    ).catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }
}
