/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { stockJsonSchema, Stock, StockDocument } from './stock.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { ProductItemService } from '../productItem/productItem.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock.name)
    private stockModel: Model<Stock>,
    private productItemService: ProductItemService,
    private purchaseOrderService: PurchaseOrderService,
    private categoryService: CategoryService,
  ) {}

  /**
   * get stock schema
   * @returns
   */
  async getSchema() {
    const stockSchema = await stockJsonSchema.Stock;
    stockSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: stockSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all stock
   * @param pageOptionsDto
   * @returns
   */

  async getStock(pageOptionsDto: PageOptionsDto): Promise<Stock[]> {
    const queryBuilder = await this.stockModel
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
   * get single Stock
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Stock[]> {
    const queryBuilder = await this.stockModel
      .find({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async findByProductAndPacking(
    productItemId: object,
    packingSizeId: object,
  ): Promise<Stock[]> {
    const queryBuilder = await this.stockModel
      .find({
        $and: [
          { productItemId: productItemId },
          { packingSizeId: packingSizeId },
          { isActive: true },
        ],
      })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async findOneById(id: string): Promise<Stock> {
    const queryBuilder = await this.stockModel
      .findOne({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async customCreateUpdateStock(createDto, poId) {
    // ***********
    const stockExist = await this.findByProductAndPacking(
      createDto.productItemId,
      createDto.packingsizeId,
    );
    if (stockExist.length > 0) {
      await this.update(stockExist[0].id, {
        salestoreId: createDto.saleStoreId,
        productItemId: createDto.productItemId,
        qty: stockExist[0].qty + createDto.receivedBags,
        packingSizeId: createDto.packingsizeId,
        purchaseOrderId: poId,
      });
    } else {
      await this.create({
        salestoreId: createDto.saleStoreId,
        productItemId: createDto.productItemId,
        qty: createDto.receivedBags,
        packingSizeId: createDto.packingsizeId,
        purchaseOrderId: poId,
      });
    }
  }

  /**
   * post
   * @param createDto
   * @returns
   */
  async create(createDto): Promise<StockDocument> {
    const respProductItem = await this.productItemService.findOneById(
      createDto['productItemId'],
    );
    const respPurchaseOrder = await this.purchaseOrderService.findById(
      createDto['purchaseOrderId'],
    );
    const respCategory = await this.categoryService.findOneById(
      respPurchaseOrder[0]['categoryId'].toString(),
    );
    const stockData: any = {
      salestoreId: createDto['salestoreId'],
      productItemId: createDto['productItemId'],
      productItem: respProductItem['name'],
      packingSizeId: createDto['packingSizeId'],
      qty: createDto['qty'],
      subcategory: respCategory['_id'],
      category: respCategory['categoryId'],
    };

    const create: StockDocument = new this.stockModel(stockData);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  async getStockByPackingFK(productItemId, packingSizeId): Promise<Stock[]> {
    const queryBuilder = await this.stockModel
      .aggregate([
        {
          $match: {
            isActive: true,
            productItemId: new mongoose.Types.ObjectId(productItemId),
            packingSizeId: new mongoose.Types.ObjectId(packingSizeId),
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
   * patch
   * @param id & stock object
   * @return
   */
  async update(id: string, createDto): Promise<StockDocument> {
    const respProductItem = await this.productItemService.findOneById(
      createDto['productItemId'],
    );
    const respPurchaseOrder = await this.purchaseOrderService.findById(
      createDto['purchaseOrderId'],
    );
    const respCategory = await this.categoryService.findOneById(
      respPurchaseOrder[0]['categoryId'].toString(),
    );
    const stockData: any = {
      salestoreId: createDto['salestoreId'],
      productItemId: createDto['productItemId'],
      productItem: respProductItem['name'],
      packingSizeId: createDto['packingSizeId'],
      qty: createDto['qty'],
      subcategory: respCategory['_id'],
      category: respCategory['categoryId'],
    };

    return await this.stockModel
      .findByIdAndUpdate({ _id: id }, stockData)
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
    return await this.stockModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  async findByIdAndPIId(productItemId, packSizeId): Promise<Stock[]> {
    const queryBuilder = await this.stockModel
      .find({
        $and: [
          { productItemId: productItemId },
          { packingSizeId: packSizeId },
          { isActive: true },
        ],
      })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async updateByCommodityUpdation(
    oldPackingData,
    newpackingData,
  ): Promise<StockDocument> {
    let willUpdateStock = await this.findByIdAndPIId(
      oldPackingData.productItemId,
      newpackingData.packingsizeId,
    );
    let updatedQty =
      willUpdateStock[0]['qty'] -
      oldPackingData['receivedBags'] +
      newpackingData['receivedBags'];
    return await this.stockModel
      .findByIdAndUpdate(
        { _id: willUpdateStock[0]['_id'] },
        { qty: updatedQty },
      )
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }

  async updateByPackingDeletion(
    willDeletePacking,
    stockToBeUpdate,
  ): Promise<StockDocument> {
    let updatedQty = stockToBeUpdate['qty'] - willDeletePacking['receivedBags'];
    return await this.stockModel
      .findByIdAndUpdate({ _id: stockToBeUpdate['_id'] }, { qty: updatedQty })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}

