/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  productionOutputJsonSchema,
  ProductionOutput,
  ProductionOutputDocument,
} from './productionOutput.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { ProductionOutputDtoDto } from './dto/productionOutputDto.dto';
import { DryService } from '../dry/dry.service';
import { PackingService } from '../packing/packing.service';
import { LabourExpenseService } from '../labourExpense/labourExpense.service';

@Injectable()
export class ProductionOutputService {
  constructor(
    @InjectModel(ProductionOutput.name)
    private productionOutputModel: Model<ProductionOutput>,
    private dryService: DryService,
    private packingService: PackingService,
    private labourExpenseService: LabourExpenseService,
  ) {}

  /**
   * get production Output schema
   * @returns
   */
  async getSchema() {
    const productOutputSchema =
      await productionOutputJsonSchema.ProductionOutput;
    productOutputSchema['properties']['_id'] = {
      type: 'string',
    };

    const customSchema = {
      schema: productOutputSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
    return await productionOutputJsonSchema.ProductionOutput;
  }

  /**
   * get all productionOutput
   * @param pageOptionsDto
   * @returns
   */

  async getProductionOutput(
    pageOptionsDto: PageOptionsDto,
  ): Promise<ProductionOutput[]> {
    const queryBuilder = await this.productionOutputModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'labourexpenses',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  isActive: true,
                  $expr: { $eq: ['$assetId', '$$id'] },
                },
              },
            ],
            as: 'labourExpenseSchema',
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
   * get single ProductionOutput
   * @param id
   * @returns
   */
  async findById(id: string): Promise<ProductionOutput[]> {
    const queryBuilder = await this.productionOutputModel
      .find({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async getProductionOutputByFK(id: string): Promise<ProductionOutput[]> {
    const queryBuilder = await this.productionOutputModel
      .aggregate([
        {
          $match: {
            isActive: true,
            commodityIssueForProductionId: new mongoose.Types.ObjectId(id),
          },
        },
      ])
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
  async create(createDto: ProductionOutput): Promise<ProductionOutputDocument> {
    const create: ProductionOutputDocument = new this.productionOutputModel(
      createDto,
    );
    const productionCreate = await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
    const productionId = productionCreate.id;
    if (createDto.hasOwnProperty('radioDryPack')) {
      if (createDto['radioDryPack'] === 'Dry') {
        this.dryCreate(
          productionId,
          createDto['Dry'],
          createDto['purchaseOrderId'],
          createDto['productItemId'],
        );
      } else if (createDto['radioDryPack'] === 'Packing') {
        this.packCreate(
          productionId,
          createDto['Packing'],
          createDto['purchaseOrderId'],
          createDto['productItemId'],
        );
      }
    }
    if (createDto.hasOwnProperty('labourExpenseSchema')) {
      await this.labourExpenseService.createByProduction(
        createDto['labourExpenseSchema'],
        productionId,
      );
    }
    return productionId;
  }

  async dryCreate(id: string, item: any, poId, productItemId) {
    for (let i = 0; i < item.length; i++) {
      item[i].productionOutputId = id;
      const resp = await this.dryService
        .create(item[i], poId, productItemId)
        .catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }
  }
  async packCreate(id: string, item: any, poId, productItemId) {
    for (let i = 0; i <= item.length; i++) {
      item[i]['productionOutputId'] = id;
      const resp = await this.packingService
        .create(item[i], poId, productItemId)
        .catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }
  }
  /**
   *
   * patch
   * @param id & productionOutput object
   * @return
   */
  async update(
    id: string,
    productionOutputData: ProductionOutputDtoDto,
  ): Promise<ProductionOutputDocument> {
    return await this.productionOutputModel
      .findByIdAndUpdate({ _id: id }, productionOutputData)
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
    /**
     * delete 'Dry' of 'Production Output'
     */
    const productionOutput = await this.dryService.getDryByFK(id);
    productionOutput.forEach(async (item) => {
      await this.dryService.delete(item['_id']);
    });
    /**
     * delete 'labourExpense' of 'commodityIssueForProduction'
     */
    const existingExpense =
      await this.labourExpenseService.getlabourExpenseByFK(id);
    existingExpense.forEach(async (item) => {
      await this.labourExpenseService.delete(item['_id']);
    });
    /**
     * delete 'productionOutput'
     */
    return await this.productionOutputModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
