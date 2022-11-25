/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  commodityIssueForProductionJsonSchema
   ,CommodityIssueForProduction,
  CommodityIssueForProductionDocument,
} from './commodityIssueForProduction.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { ProductionOutputService } from '../productionOutput/productionOutput.service';
import { DryService } from '../dry/dry.service';
import { PackingService } from '../packing/packing.service';
import { LabourExpenseService } from '../labourExpense/labourExpense.service';
import { StoreService } from '../store/store.service';
import { PackingSizeService } from '../packingSize/packingSize.service';
import { SaleStoreService } from '../saleStore/saleStore.service';
import { ProductItemService } from '../productItem/productItem.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { WarehouseService } from '../warehouse/warehouse.service';
@Injectable()
export class CommodityIssueForProductionService {
  constructor(
    @InjectModel(CommodityIssueForProduction.name)
    private commodityIssueForProductionModel: Model<CommodityIssueForProduction>,
    private productionOutputService: ProductionOutputService,
    private dryService: DryService,
    private packingService: PackingService,
    private labourExpenseService: LabourExpenseService,
    private storeService: StoreService,
    private packingSizeService: PackingSizeService,
    private saleStoreService: SaleStoreService,
    private productItemService: ProductItemService,
    private purchaseOrderService: PurchaseOrderService,
    private warehouseService: WarehouseService,
  ) {}

  /**
   * get Commodity Issue For Production schema
   * @returns
   */
  async getSchema() {
    // get schemas
    const issueForProductionSchema =
      await commodityIssueForProductionJsonSchema.CommodityIssueForProduction;
    const productionOutputSchema =
      await this.productionOutputService.getSchema();
    const drySchema = await this.dryService.getSchema();
    const packingSchema = await this.packingService.getSchema();
    const labourExpenseSchema = await this.labourExpenseService.getSchema();
    // end schema imports
    issueForProductionSchema['properties']['_id'] = {
      type: 'string',
    };
    /**
     * Get PurchaseOrder Enum data
     */
    // const purchaseOrderData = await this.purchaseOrderService.getPurchaseOrder({
    //   column: '_id',
    //   order: 1,
    //   take: 1000,
    //   skip: 0,
    // });

    //const purchaseOrderNameData = [];
    // purchaseOrderData[0]['data'].forEach((element) => {
    //   purchaseOrderIdData.push(element._id);
    //   //purchaseOrderNameData.push(element.name);
    // });

    //issueForProductionSchema['properties']['purchaseOrderId']['enumNames'] = purchaseOrderNameData;

    /**
     * get store data
     *
     */
    const storeData = await this.warehouseService.getWarehouse({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    issueForProductionSchema['properties']['storeId']['type'] = 'string';
    issueForProductionSchema['properties']['storeId']['selectValue'] =
      storeData[0]['data'];

    /**
     * Get ProductItem Enum data
     */
    const productItemData = await this.productItemService.getProductItem({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const productItemIdData = [];
    const productItemNameData = [];
    productItemData[0]['data'].forEach((element) => {
      productItemIdData.push(element._id);
      productItemNameData.push(element.name);
    });
    productionOutputSchema.schema['properties']['productItemId']['enum'] =
      productItemIdData;
    productionOutputSchema.schema['properties']['productItemId']['enumNames'] =
      productItemNameData;

    /**
     * Get Packing Size Enum data
     */
    const packingSizeData = await this.packingSizeService.getPackingSize({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const packingSizeIdData = [];
    const packingSizeNameData = [];
    packingSizeData[0]['data'].forEach((element) => {
      packingSizeIdData.push(element._id);
      packingSizeNameData.push(element.size);
    });
    productionOutputSchema.schema['properties']['packingSize']['enum'] =
      packingSizeIdData;
    productionOutputSchema.schema['properties']['packingSize']['enumNames'] =
      packingSizeNameData;

    packingSchema.schema['properties']['packingsizeId']['enum'] =
      packingSizeIdData;
    packingSchema.schema['properties']['packingsizeId']['enumNames'] =
      packingSizeNameData;

    /**
     * Get Salestore Enum data
     */
    const saleStoreData = await this.saleStoreService.getSaleStore({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const saleStoreIdData = [];
    const saleStoreNameData = [];
    saleStoreData[0]['data'].forEach((element) => {
      saleStoreIdData.push(element._id);
      saleStoreNameData.push(element.name);
    });
    packingSchema.schema['properties']['saleStoreId']['enum'] = saleStoreIdData;
    packingSchema.schema['properties']['saleStoreId']['enumNames'] =
      saleStoreNameData;

    // assign labour schema to Packing schema
    packingSchema.schema.properties.labourExpenseSchema = {
      type: 'array',
      title: 'Labour Expense For Packing',
      items: labourExpenseSchema.schema,
    };

    const packingSchemaArray = {
      type: 'array',
      title: 'Packing',
      items: packingSchema.schema,
    };

    // assign labour schema to dry schema
    drySchema.schema.properties.labourExpenseSchema = {
      type: 'array',
      title: 'Labour Expense For Dry',
      items: labourExpenseSchema.schema,
    };

    // assign packing schema to dry schema
    drySchema.schema.properties.Packing = {
      type: 'array',
      title: 'Packing',
      items: packingSchema.schema,
    };

    const drySchemaArray = {
      type: 'array',
      title: 'Dry',
      items: drySchema.schema,
    };

    // assign labour schema to productionOutput schema
    productionOutputSchema.schema.properties.labourExpenseSchema = {
      type: 'array',
      title: 'Labour Expense For ProductionOutput',
      items: labourExpenseSchema.schema,
    };

    // assign dry schema to production out schema
    productionOutputSchema.schema.properties.radioDryPack = {
      type: 'string',
      title: 'RadioButton',
      enum: ['Dry', 'Packing'],
    };
    productionOutputSchema.schema.dependencies = {
      radioDryPack: {
        oneOf: [
          {
            properties: {
              radioDryPack: {
                enum: ['Dry'],
              },
              Dry: drySchemaArray,
            },
          },
          {
            properties: {
              radioDryPack: {
                enum: ['Packing'],
              },
              Packing: packingSchemaArray,
            },
          },
        ],
      },
    };

    // assign labour schema to issueForProduction schema
    issueForProductionSchema.properties.labourExpenseSchema = {
      type: 'array',
      title: 'Labour Expense For Commodity Issue',
      items: labourExpenseSchema.schema,
    };

    // assign production output to IssueForProduction schema
    issueForProductionSchema.properties.productionOutputSchema = {
      type: 'array',
      title: 'Production Output',
      items: productionOutputSchema.schema,
    };
    const customSchema = {
      schema: issueForProductionSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        purchaseOrderId: { 'ui:widget': 'myCustomAsyncPurchaseTypeAhead' },
        storeId: { 'ui:widget': 'myCustomStoreTypeAhead' },
        labourExpenseSchema: {
          'ui:options': {
            orderable: false,
          },
          items: {
            _id: {
              'ui:widget': 'hidden',
            },
            contractorID: {
              'ui:widget': 'myCustomSelectTypeAhead',
            },
            typeId: {
              'ui:widget': 'myCustomSelectTypeAhead',
            },
          },
        },
        productionOutputSchema: {
          'ui:options': {
            orderable: false,
          },
          items: {
            _id: {
              'ui:widget': 'hidden',
            },
            radioDryPack: {
              'ui:widget': 'radio',
              'ui:options': {
                inline: true,
              },
            },
            labourExpenseSchema: {
              'ui:options': {
                orderable: false,
              },
              items: {
                _id: {
                  'ui:widget': 'hidden',
                },
              },
            },
            Packing: {
              'ui:options': {
                orderable: false,
              },
              items: {
                packingSize: {
                  'ui:widget': 'hidden',
                },
                productItem: {
                  'ui:widget': 'hidden',
                },
                saleStore: {
                  'ui:widget': 'hidden',
                },
                productionOutput: {
                  'ui:widget': 'hidden',
                },
                labourExpenseSchema: {
                  items: {
                    _id: {
                      'ui:widget': 'hidden',
                    },
                  },
                },
              },
            },
            Dry: {
              'ui:options': {
                orderable: false,
              },
              items: {
                labourExpenseSchema: {
                  items: {
                    _id: {
                      'ui:widget': 'hidden',
                    },
                  },
                },
                Packing: {
                  'ui:options': {
                    orderable: false,
                  },
                  items: {
                    packingSize: {
                      'ui:widget': 'hidden',
                    },
                    productItem: {
                      'ui:widget': 'hidden',
                    },
                    saleStore: {
                      'ui:widget': 'hidden',
                    },
                    productionOutput: {
                      'ui:widget': 'hidden',
                    },
                    labourExpenseSchema: {
                      items: {
                        _id: {
                          'ui:widget': 'hidden',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        drySchema: {
          'ui:options': {
            orderable: false,
          },
          items: {
            _id: {
              'ui:widget': 'hidden',
            },
          },
        },
        packingSchema: {
          'ui:options': {
            orderable: false,
          },
          items: {
            _id: {
              'ui:widget': 'hidden',
            },
          },
        },
      },
    };
    return customSchema;
  }

  /**
   * get all commodityIssueForProduction
   * @param pageOptionsDto
   * @returns
   */

  async getCommodityIssueForProduction(
    pageOptionsDto: PageOptionsDto,
  ): Promise<CommodityIssueForProduction[]> {
    const queryBuilder = await this.commodityIssueForProductionModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'productionoutputs',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $and: [
                    {
                      $expr: {
                        $eq: ['$commodityIssueForProductionId', '$$id'],
                      },
                    },
                  ],
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
                $lookup: {
                  from: 'dries',
                  let: { productionOutputID: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$productionOutputId', '$$productionOutputID'],
                        },
                      },
                    },
                    {
                      $lookup: {
                        from: 'packings',
                        let: { dryID: '$_id' },
                        pipeline: [
                          { $match: { $expr: { $eq: ['$dryId', '$$dryID'] } } },
                          {
                            $lookup: {
                              from: 'labourexpenses',
                              let: { packingID: '$_id' },
                              pipeline: [
                                {
                                  $match: {
                                    isActive: true,
                                    $expr: {
                                      $eq: ['$assetId', '$$packingID'],
                                    },
                                  },
                                },
                              ],
                              as: 'labourExpenseSchema',
                            },
                          },
                        ],
                        as: 'Packing',
                      },
                    },
                    {
                      $lookup: {
                        from: 'labourexpenses',
                        let: { productionOutputID: '$_id' },
                        pipeline: [
                          {
                            $match: {
                              isActive: true,
                              $expr: {
                                $eq: ['$assetId', '$$productionOutputID'],
                              },
                            },
                          },
                        ],
                        as: 'labourExpenseSchema',
                      },
                    },
                  ],
                  as: 'Dry',
                },
              },
              {
                $lookup: {
                  from: 'packings',
                  let: { productionOutputID: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$productionOutputId', '$$productionOutputID'],
                        },
                      },
                    },
                    {
                      $lookup: {
                        from: 'labourexpenses',
                        let: { productionOutputID: '$_id' },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $eq: ['$assetId', '$$productionOutputID'],
                              },
                            },
                          },
                        ],
                        as: 'labourExpenseSchema',
                      },
                    },
                  ],
                  as: 'Packing',
                },
              },
            ],
            as: 'productionOutputSchema',
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
   * get single CommodityIssueForProduction
   * @param id
   * @returns
   */
  async findById(id: string): Promise<CommodityIssueForProduction[]> {
    const queryBuilder = await this.commodityIssueForProductionModel
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
  async create(
    createDto: CommodityIssueForProduction,
  ): Promise<CommodityIssueForProductionDocument> {
    const create: CommodityIssueForProductionDocument =
      new this.commodityIssueForProductionModel(createDto);
    const resp = await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });

    if (createDto.hasOwnProperty('labourExpenseSchema')) {
      await this.labourExpenseService
        .createByProduction(createDto['labourExpenseSchema'], resp.id)
        .catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    }

    if (createDto.hasOwnProperty('productionOutputSchema')) {
      //const purchaseOrderId = createDto['purchaseOrderId'];
      //const storeId = createDto['storeId'];
      const dataWithProductionOutput = createDto['productionOutputSchema'];
      for (let i = 0; i < dataWithProductionOutput.length; i++) {
        const record = dataWithProductionOutput[i];
        record['purchaseOrderId'] = createDto['purchaseOrderId'];
        record['storeId'] = createDto['storeId'];
        record['commodityIssueForProductionId'] = resp['_id'];
        //dataWithProductionOutput[i] = record;
        const productionoutputRet = await this.productionOutputService
          .create(record)
          .catch((err) => {
            throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
          });

        // if (dataWithProductionOutput[i].hasOwnProperty('labourExpenseSchema')) {
        //   await this.labourExpenseService.createByProduction(
        //     dataWithProductionOutput[i]['labourExpenseSchema'],
        //     productionoutputRet.id,
        //   );
        // }

        // const productItemId = new mongoose.Types.ObjectId(
        //   dataWithProductionOutput[i]['productItemId'],
        // );
        // const purchaseOrderData = await this.purchaseOrderService.findById(
        //   purchaseOrderId.toString(),
        // );
        // const supplier =
        //   purchaseOrderData[0]['supplier']['firstName'] +
        //   ' ' +
        //   purchaseOrderData[0]['supplier']['lastName'];
        // if (dataWithProductionOutput[i].hasOwnProperty('radioDryPack')) {
        //   if (dataWithProductionOutput[i]['radioDryPack'] === 'Dry') {
        //     const dryData = dataWithProductionOutput[i]['Dry'];
        //     for (let k = 0; k < dryData.length; k++) {
        //       const newRecord = dryData[k];
        //       // newRecord['storeId'] = storeId;
        //       // newRecord['productionOutputId'] = productionOutputID;
        //       // dryData[k] = newRecord;
        //       // const resp = await this.dryService.create(dryData[k]);
        //       // dryID = resp.id;
        //       // if (dryData[k].hasOwnProperty('labourExpenseSchema')) {
        //       //   await this.labourExpenseService.createByProduction(
        //       //     dryData[k]['labourExpenseSchema'],
        //       //     dryID,
        //       //   );
        //       // }
        //       if (dryData[k].hasOwnProperty('Packing')) {
        //         const dataMoreNew = dryData[k];
        //         const dataWithPacking = dataMoreNew['Packing'];
        //         // for (let l = 0; l < dataWithPacking.length; l++) {
        //         //   const newRecordMore = dataWithPacking[l];
        //         //   newRecordMore['dryId'] = dryID;
        //         //   newRecordMore['productItemId'] = productItemId;
        //         //   newRecordMore['supplier'] = supplier;
        //         //   dataWithPacking[l] = newRecordMore;
        //         //   const resp = await this.packingService.create(
        //         //     dataWithPacking[l],
        //         //   );
        //         //   const packingID = resp.id;
        //         //   if (
        //         //     dataWithPacking[l].hasOwnProperty('labourExpenseSchema')
        //         //   ) {
        //         //     await this.labourExpenseService.createByProduction(
        //         //       dataWithPacking[l]['labourExpenseSchema'],
        //         //       packingID,
        //         //     );
        //         //   }
        //         //   const packingsizeId = new mongoose.Types.ObjectId(
        //         //     dataWithPacking[l]['packingsizeId'],
        //         //   );
        //         //   const stockExist =
        //         //     await this.stockService.findByProductAndPacking(
        //         //       productItemId,
        //         //       packingsizeId,
        //         //     );
        //         //   if (stockExist.length > 0) {
        //         //     const stockData =
        //         //       await this.packingService.findPackingByStock(
        //         //         packingsizeId,
        //         //         productItemId,
        //         //       );
        //         //     for (let y = 0; y < stockData.length; y++) {
        //         //       await this.stockService.update(stockExist[0].id, {
        //         //         salestoreId: dataWithPacking[l]['saleStoreId'],
        //         //         productItemId: productItemId,
        //         //         qty: stockData[y]['totalQty'],
        //         //         packingSizeId: stockData[y]['_id'],
        //         //         purchaseOrderId: purchaseOrderId,
        //         //       });
        //         //     }
        //         //   } else {
        //         //     const stockData =
        //         //       await this.packingService.findPackingByStock(
        //         //         packingsizeId,
        //         //         productItemId,
        //         //       );
        //         //     for (let y = 0; y < stockData.length; y++) {
        //         //       await this.stockService.create({
        //         //         salestoreId: dataWithPacking[l]['saleStoreId'],
        //         //         productItemId: productItemId,
        //         //         qty: stockData[y]['totalQty'],
        //         //         packingSizeId: stockData[y]['_id'],
        //         //         purchaseOrderId: purchaseOrderId,
        //         //       });
        //         //     }
        //         //   }
        //         // }
        //       } else {
        //         console.log('please add PackingDetails');
        //       }
        //     }
        //   }
        //   // else if (
        //   //   dataWithProductionOutput[i]['radioDryPack'] === 'Packing'
        //   // ) {
        //   //   const packingData = dataWithProductionOutput[i]['Packing'];
        //   //   for (let j = 0; j < packingData.length; j++) {
        //   //     const newRecord = packingData[j];
        //   //     newRecord['productionOutputId'] = productionOutputID;
        //   //     newRecord['productItemId'] = productItemId;
        //   //     newRecord['supplier'] = supplier;
        //   //     packingData[j] = newRecord;
        //   //     const resp = await this.packingService
        //   //       .create(packingData[j])
        //   //       .catch((err) => {
        //   //         console.log('');
        //   //       });
        //   //     const packingID = resp['id'];
        //   //     if (packingData[j].hasOwnProperty('labourExpenseSchema')) {
        //   //       await this.labourExpenseService.createByProduction(
        //   //         packingData[j]['labourExpenseSchema'],
        //   //         packingID,
        //   //       );
        //   //     }
        //   //     const packingsizeId = new mongoose.Types.ObjectId(
        //   //       packingData[j]['packingsizeId'],
        //   //     );
        //   //     const stockExist =
        //   //       await this.stockService.findByProductAndPacking(
        //   //         productItemId,
        //   //         packingsizeId,
        //   //       );
        //   //     if (stockExist.length > 0) {
        //   //       const stockData = await this.packingService.findPackingByStock(
        //   //         packingsizeId,
        //   //         productItemId,
        //   //       );
        //   //       for (let y = 0; y < stockData.length; y++) {
        //   //         await this.stockService.update(stockExist[0].id, {
        //   //           salestoreId: packingData[j]['saleStoreId'],
        //   //           productItemId: productItemId,
        //   //           qty: stockData[y]['totalQty'],
        //   //           packingSizeId: stockData[y]['_id'],
        //   //           purchaseOrderId: purchaseOrderId,
        //   //         });
        //   //       }
        //   //     } else {
        //   //       const stockData = await this.packingService.findPackingByStock(
        //   //         packingsizeId,
        //   //         productItemId,
        //   //       );
        //   //       for (let y = 0; y < stockData.length; y++) {
        //   //         await this.stockService.create({
        //   //           salestoreId: packingData[j]['saleStoreId'],
        //   //           productItemId: productItemId,
        //   //           qty: stockData[y]['totalQty'],
        //   //           packingSizeId: stockData[y]['_id'],
        //   //           purchaseOrderId: purchaseOrderId,
        //   //         });
        //   //       }
        //   //     }
        //   //   }
        //   // }
        // } else {
        //   console.log('please add drydetails/packingdetails');
        // }
      }
    } else {
      console.log('please Add productionOutputDetails');
    }

    return resp;
  }

  /**
   *
   * patch
   * @param id & commodityIssueForProduction object
   * @return
   */
  async update(
    id: string,
    createDto: any,
  ): Promise<CommodityIssueForProductionDocument> {
    let productionOutputID: string;
    let dryID: string;
    const poId = createDto.purchaseOrderId;
    const resp = await this.commodityIssueForProductionModel
      .findByIdAndUpdate({ _id: id }, createDto)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    const commodityIssueID = resp.id;
    // *
    // ** Labour Expense for CommodityIssueForProduction
    // ***
    if (createDto.hasOwnProperty('labourExpenseSchema')) {
      const labourExpenseSchema = createDto['labourExpenseSchema'];
      const ids = labourExpenseSchema.map((item) => {
        return item._id;
      });
      const existingExpense =
        await this.labourExpenseService.getlabourExpenseByFK(id);
      const deletedIds = existingExpense.filter((x) => {
        let status = false;
        ids.forEach((item) => {
          if (item == x['_id'].toString()) {
            status = true;
          }
        });
        if (!status) return x['_id'];
      });
      deletedIds.forEach(async (item) => {
        await this.labourExpenseService.delete(item['_id']);
      });
      labourExpenseSchema.forEach(async (item) => {
        if (item._id) {
          await this.labourExpenseService
            .update(item._id, item)
            .catch((err) => {
              throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
            });
        } else {
          item.assetId = id;
          await this.labourExpenseService.create(item).catch((err) => {
            throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
          });
        }
      });
    }
    // *
    // ** ProductionOutput
    // ***
    if (createDto.hasOwnProperty('productionOutputSchema')) {
      const dataWithProductionOutput = createDto['productionOutputSchema'];
      const ids = dataWithProductionOutput.map((item) => {
        return item._id;
      });
      const productItemids = dataWithProductionOutput.map((item) => {
        return item.productItemId;
      });
      // *
      // ** Check already existing ProductionOutput entries against current commodityIssueID
      // ***
      const existingOutputs =
        await this.productionOutputService.getProductionOutputByFK(
          commodityIssueID,
        );
      // *
      // ** Check ProductionOutput entries that removed in updation by filtering
      // ***
      const deletedIds = existingOutputs.filter((x) => {
        let status = false;
        ids.forEach((item) => {
          if (item == x['_id'].toString()) {
            status = true;
          }
        });
        if (!status) return x['_id'];
      });
      // *
      // ** Delete ProductionOutput entries if these removed in updation
      // ***
      deletedIds.forEach(async (item) => {
        await this.productionOutputService.delete(item['_id']);
      });
      let currenPproductionOutput;

      dataWithProductionOutput.forEach(async (item) => {
        // *
        // ** In ProductionOutput If _id exist then 'update' already existed data othervise 'Add New'
        // ***
        if (item._id) {
          currenPproductionOutput = item._id;
          await this.productionOutputService
            .update(item._id, item)
            .catch((err) => {
              throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
            });
        } else {
          item.assetId = id;
          await this.productionOutputService.create(item).catch((err) => {
            throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
          });
        }
      });
      for (let i = 0; i < ids.length; i++) {
        productionOutputID = ids[i];
        // *
        // ** If ProductionOutput have labourExpense 'Add' or 'Update' it
        // ***
        if (dataWithProductionOutput[i].hasOwnProperty('labourExpenseSchema')) {
          const labourExpenseSchema =
            dataWithProductionOutput[i]['labourExpenseSchema'];
          const ids = labourExpenseSchema.map((item) => {
            return item._id;
          });
          // *
          // ** If ProductionOutput have existing labourExpense
          // ***
          const existingExpense =
            await this.labourExpenseService.getlabourExpenseByFK(
              productionOutputID,
            );
          // *
          // ** filter and delete those ProductionOutput labourExpense that has been removed in updation
          // ***
          const deletedIds = existingExpense.filter((x) => {
            let status = false;
            ids.forEach((item) => {
              if (item == x['_id'].toString()) {
                status = true;
              }
            });
            if (!status) return x['_id'];
          });
          deletedIds.forEach(async (item) => {
            await this.labourExpenseService.delete(item['_id']);
          });
          // *
          // ** Add or Update 'ProductionOutput' labourExpense
          // ***
          labourExpenseSchema.forEach(async (item) => {
            if (item._id) {
              await this.labourExpenseService
                .update(item._id, item)
                .catch((err) => {
                  throw new HttpException(
                    err.message,
                    ResponseCode.BAD_REQUEST,
                  );
                });
            } else {
              item.assetId = currenPproductionOutput;
              await this.labourExpenseService.create(item).catch((err) => {
                throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
              });
            }
          });
        }
        // *
        // ** If ProductionOutput have Dry or Pack data
        // ***
        if (dataWithProductionOutput[i].hasOwnProperty('radioDryPack')) {
          if (dataWithProductionOutput[i]['radioDryPack'] === 'Dry') {
            const dryData = dataWithProductionOutput[i]['Dry'];
            const idsDry = dryData.map((item) => {
              return item._id;
            });
            const existingDry = await this.dryService.getDryByFK(
              productionOutputID,
            );
            const deletedIds = existingDry.filter((x) => {
              let status = false;
              idsDry.forEach((item) => {
                if (item == x['_id'].toString()) {
                  status = true;
                }
              });
              if (!status) return x['_id'];
            });
            deletedIds.forEach(async (item) => {
              await this.dryService.delete(item['_id']);
            });
            // *
            // ** 'Add' or 'Update' Dry
            // ***
            dryData.forEach(async (item) => {
              if (item._id) {
                await this.dryService.update(item._id, item).catch((err) => {
                  throw new HttpException(
                    err.message,
                    ResponseCode.BAD_REQUEST,
                  );
                });
              } else {
                item.productionOutputId = productionOutputID;
                await this.dryService
                  .create(item, poId, item.productItemId)
                  .catch((err) => {
                    throw new HttpException(
                      err.message,
                      ResponseCode.BAD_REQUEST,
                    );
                  });
              }
            });
            for (let k = 0; k < idsDry.length; k++) {
              dryID = idsDry[k];
              // *
              // ** Check if 'Dry' have labourExpense
              // ***
              if (dryData[k].hasOwnProperty('labourExpenseSchema')) {
                const labourExpenseSchema = dryData[k]['labourExpenseSchema'];
                const ids = labourExpenseSchema.map((item) => {
                  return item._id;
                });
                const existingExpense =
                  await this.labourExpenseService.getlabourExpenseByFK(dryID);
                const deletedIds = existingExpense.filter((x) => {
                  let status = false;
                  ids.forEach((item) => {
                    if (item == x['_id'].toString()) {
                      status = true;
                    }
                  });
                  if (!status) return x['_id'];
                });
                deletedIds.forEach(async (item) => {
                  await this.labourExpenseService.delete(item['_id']);
                });
                // *
                // ** Add or Update 'Dry' labourExpense
                // ***
                labourExpenseSchema.forEach(async (item) => {
                  if (item._id) {
                    await this.labourExpenseService
                      .update(item._id, item)
                      .catch((err) => {
                        throw new HttpException(
                          err.message,
                          ResponseCode.BAD_REQUEST,
                        );
                      });
                  } else {
                    item.assetId = dryData[k]['_id'];
                    await this.labourExpenseService
                      .create(item)
                      .catch((err) => {
                        throw new HttpException(
                          err.message,
                          ResponseCode.BAD_REQUEST,
                        );
                      });
                  }
                });
              }
              if (dryData[k].hasOwnProperty('Packing')) {
                const dataMoreNew = dryData[k];
                const dataWithPacking = dataMoreNew['Packing'];
                const idsPacking = dataWithPacking.map((item) => {
                  return item._id;
                });
                const existingPacking =
                  await this.packingService.getPackingByDryFK(dryID);
                const deletedIds = existingPacking.filter((x) => {
                  let status = false;
                  idsPacking.forEach((item) => {
                    if (item == x['_id'].toString()) {
                      status = true;
                    }
                  });
                  if (!status) return x['_id'];
                });
                deletedIds.forEach(async (item) => {
                  await this.packingService.delete(item['_id']);
                });
                dataWithPacking.forEach(async (item) => {
                  if (item._id) {
                    await this.packingService
                      .update(item._id, item)
                      .catch((err) => {
                        throw new HttpException(
                          err.message,
                          ResponseCode.BAD_REQUEST,
                        );
                      });
                  } else {
                    item.productionOutputId = productionOutputID;
                    item.dryId = dryData[k]['_id'];
                    item.productItemId =
                      dataWithProductionOutput[i].productItemId;
                    await this.packingService
                      .create(item, poId, item.productItemId)
                      .catch((err) => {
                        throw new HttpException(
                          err.message,
                          ResponseCode.BAD_REQUEST,
                        );
                      });
                  }
                });
                for (let l = 0; l < idsPacking.length; l++) {
                  const packingID = idsPacking[l];
                  // *
                  // ** Check if 'Packing' have labourExpense
                  // ***
                  if (
                    dataWithPacking[l].hasOwnProperty('labourExpenseSchema')
                  ) {
                    const labourExpenseSchema =
                      dataWithPacking[l]['labourExpenseSchema'];
                    const ids = labourExpenseSchema.map((item) => {
                      return item._id;
                    });
                    const existingExpense =
                      await this.labourExpenseService.getlabourExpenseByFK(
                        packingID,
                      );
                    const deletedIds = existingExpense.filter((x) => {
                      let status = false;
                      ids.forEach((item) => {
                        if (item == x['_id'].toString()) {
                          status = true;
                        }
                      });
                      if (!status) return x['_id'];
                    });
                    deletedIds.forEach(async (item) => {
                      await this.labourExpenseService.delete(item['_id']);
                    });
                    // *
                    // ** Add or Update 'Packing' labourExpense
                    // ***
                    labourExpenseSchema.forEach(async (item) => {
                      if (item._id) {
                        await this.labourExpenseService
                          .update(item._id, item)
                          .catch((err) => {
                            throw new HttpException(
                              err.message,
                              ResponseCode.BAD_REQUEST,
                            );
                          });
                      } else {
                        item.assetId = dataWithPacking[l]['_id'];
                        await this.labourExpenseService
                          .create(item)
                          .catch((err) => {
                            throw new HttpException(
                              err.message,
                              ResponseCode.BAD_REQUEST,
                            );
                          });
                      }
                    });
                  }
                }
              } else {
                console.log('please add PackingDetails');
              }
            }
          } else if (
            dataWithProductionOutput[i]['radioDryPack'] === 'Packing'
          ) {
            const packingData = dataWithProductionOutput[i]['Packing'];
            const idsPacking = packingData.map((item) => {
              return item._id;
            });
            const existingPacking =
              await this.packingService.getPackingByProductionFK(
                productionOutputID,
              );
            const deletedIds = existingPacking.filter((x) => {
              let status = false;
              idsPacking.forEach((item) => {
                if (item == x['_id'].toString()) {
                  status = true;
                }
              });
              if (!status) return x['_id'];
            });
            deletedIds.forEach(async (item) => {
              await this.packingService.delete(item['_id']);
            });
            packingData.forEach(async (item) => {
              if (item._id) {
                await this.packingService
                  .update(item._id, item)
                  .catch((err) => {
                    throw new HttpException(
                      err.message,
                      ResponseCode.BAD_REQUEST,
                    );
                  });
              }
              //  else {
              //   item.assetId = id;
              //   await this.packingService.create(item).catch((err) => {
              //     throw new HttpException(
              //       err.message,
              //       ResponseCode.BAD_REQUEST,
              //     );
              //   });
              // }
            });
            for (let j = 0; j < idsPacking.length; j++) {
              const packingID = idsPacking[j];
              if (packingData[j].hasOwnProperty('labourExpenseSchema')) {
                const labourExpenseSchema =
                  packingData[j]['labourExpenseSchema'];
                const ids = labourExpenseSchema.map((item) => {
                  return item._id;
                });
                const existingExpense =
                  await this.labourExpenseService.getlabourExpenseByFK(
                    packingID,
                  );
                const deletedIds = existingExpense.filter((x) => {
                  let status = false;
                  ids.forEach((item) => {
                    if (item == x['_id'].toString()) {
                      status = true;
                    }
                  });
                  if (!status) return x['_id'];
                });
                deletedIds.forEach(async (item) => {
                  await this.labourExpenseService.delete(item['_id']);
                });
                labourExpenseSchema.forEach(async (item) => {
                  if (item._id) {
                    await this.labourExpenseService
                      .update(item._id, item)
                      .catch((err) => {
                        throw new HttpException(
                          err.message,
                          ResponseCode.BAD_REQUEST,
                        );
                      });
                  } else {
                    item.assetId = id;
                    await this.labourExpenseService
                      .create(item)
                      .catch((err) => {
                        throw new HttpException(
                          err.message,
                          ResponseCode.BAD_REQUEST,
                        );
                      });
                  }
                });
              }
            }
          }
        } else {
          console.log('please add drydetails/packingdetails');
        }
      }
    } else {
      console.log('please Add productionOutputDetails');
    }
    return resp;
  }

  /**
   *
   * delete
   * @param id
   * @return
   */
  async delete(id: string): Promise<any> {
    /**
     * delete 'Production Output' of 'commodityIssueForProduction'
     */
    const productionOutput =
      await this.productionOutputService.getProductionOutputByFK(id);
    productionOutput.forEach(async (item) => {
      await this.productionOutputService.delete(item['_id']);
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
     * delete 'commodityIssueForProduction'
     */
    return await this.commodityIssueForProductionModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
