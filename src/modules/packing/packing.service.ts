/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { packingJsonSchema, Packing, PackingDocument } from './packing.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { PackingDtoDto } from './dto/packingDto.dto';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { LabourExpenseService } from '../labourExpense/labourExpense.service';
import { StockService } from '../stock/stock.service';

@Injectable()
export class PackingService {
  constructor(
    @InjectModel(Packing.name)
    private packingModel: Model<Packing>,
    private purchaseOrderService: PurchaseOrderService,
    private labourExpenseService: LabourExpenseService,
    private stockService: StockService,
  ) {}

  /**
   * get packing schema
   * @returns
   */
  async getSchema() {
    const packingSchema = await packingJsonSchema.Packing;
    packingSchema['properties']['_id'] = {
      type: 'string',
    };
    packingSchema.properties['packingSize'] = {
      type: 'string',
      title: 'Packing Size',
    };
    packingSchema.properties['productItem'] = {
      type: 'string',
      title: 'Product Item',
    };
    packingSchema.properties['saleStore'] = {
      type: 'string',
      title: 'Sale Store',
    };
    const customSchema = {
      schema: packingSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        packingSize: {
          'ui:widget': 'hidden',
        },
        productItem: {
          'ui:widget': 'hidden',
        },
        saleStore: {
          'ui:widget': 'hidden',
        },
      },
    };
    return customSchema;
  }

  /**
   * get all packing
   * @param pageOptionsDto
   * @returns
   */

  async getPacking(pageOptionsDto: PageOptionsDto): Promise<Packing[]> {
    const queryBuilder = await this.packingModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'packingsizes',
            localField: 'packingsizeId',
            foreignField: '_id',
            as: 'packingSize',
          },
        },
        {
          $unwind: {
            path: '$packingSize',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'productitems',
            localField: 'productItemId',
            foreignField: '_id',
            as: 'productItem',
          },
        },
        {
          $unwind: {
            path: '$productItem',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'salestores',
            localField: 'saleStoreId',
            foreignField: '_id',
            as: 'saleStore',
          },
        },
        {
          $unwind: {
            path: '$saleStore',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $addFields: {
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
            packingSize: '$packingSize.size',
            productItem: '$productItem.name',
            saleStore: '$saleStore.name',
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
   * get single Packing
   * @param id
   * @returns
   */
  async findPackingByStock(id: object, productId: object): Promise<Packing[]> {
    const queryBuilder = await this.packingModel
      .aggregate([
        {
          $match: {
            $and: [{ packingsizeId: id }, { productItemId: productId }],
          },
        },
        {
          $group: {
            _id: '$packingsizeId',
            totalQty: { $sum: '$qty' },
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
   * get single Packing
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Packing[]> {
    const queryBuilder = await this.packingModel
      .find({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async getPackingByDryFK(id: string): Promise<Packing[]> {
    const queryBuilder = await this.packingModel
      .aggregate([
        {
          $match: {
            isActive: true,
            dryId: id,
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async getPackingByProductionFK(id: string): Promise<Packing[]> {
    const queryBuilder = await this.packingModel
      .aggregate([
        {
          $match: {
            isActive: true,
            productionOutputId: id,
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
  async create(
    createDto: Packing,
    poId: string,
    productItemId: string,
  ): Promise<PackingDocument> {
    // ********************************************
    const purchaseOrderData = await this.purchaseOrderService.findById(
      poId.toString(),
    );
    createDto.productItemId = new mongoose.Types.ObjectId(productItemId);
    const supplier =
      purchaseOrderData[0]['supplier']['firstName'] +
      ' ' +
      purchaseOrderData[0]['supplier']['lastName'];
    createDto.supplier = supplier;
    // ********************************************
    const create: PackingDocument = new this.packingModel(createDto);

    const createPacking = await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });

    if (createDto.hasOwnProperty('labourExpenseSchema')) {
      await this.labourExpenseService
        .createByProduction(createDto['labourExpenseSchema'], createPacking.id)
        .catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }
    await this.stockService.customCreateUpdateStock(createDto, poId);
    return createPacking.id;
  }

  /**
   *
   * patch
   * @param id & packing object
   * @return
   */
  async update(
    id: string,
    packingData: PackingDtoDto,
  ): Promise<PackingDocument> {
    let existingPacking = await this.findById(id);
    let packingUpdateData = await this.packingModel
      .findByIdAndUpdate({ _id: id }, packingData)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    // **************************************************
    if (existingPacking) {
      await this.stockService
        .updateByCommodityUpdation(existingPacking[0], packingData)
        .catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }
    return packingUpdateData;
  }

  /**
   *
   * delete
   * @param id
   * @return
   */
  async delete(id: string): Promise<any> {
    let willDeletePacking = await this.findById(id);
    /**
     * Update 'Stock' of 'Packing'
     */
    const stockByPackingFK = await this.stockService.getStockByPackingFK(
      willDeletePacking[0]['productItemId'],willDeletePacking[0]['packingsizeId'],
    );
    await this.stockService
      .updateByPackingDeletion(willDeletePacking[0], stockByPackingFK[0])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    /**
     * delete 'labourExpense' of 'Packing'
     */
    const existingExpense =
      await this.labourExpenseService.getlabourExpenseByFK(id);
    existingExpense.forEach(async (item) => {
      await this.labourExpenseService.delete(item['_id']);
    });
    /**
     * delete 'Packing'
     */
    return await this.packingModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
