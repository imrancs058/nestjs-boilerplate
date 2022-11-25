/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PurchaseOrder,
  PurchaseOrderDocument,
  purchaseOrderJsonSchema,
} from './purchase-order.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode, ResponseMessage } from '../../exceptions';
import { PremiumService } from '../premium/premium.service';
import { SupplierService } from '../supplier/supplier.service';
import { CategoryService } from '../category/category.service';
import { Types } from 'mongoose';
import { WarehouseService } from '../warehouse/warehouse.service';
import { LabourExpenseService } from '../labourExpense/labourExpense.service';
import { LabourExpense } from '../labourExpense/labourExpense.schema';
import { ContractorService } from '../contractor/contractor.service';
import { employeeService } from '../employee/employee.service';

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectModel(PurchaseOrder.name)
    private purchaseOrderModel: Model<PurchaseOrder>,
    private contractorService: ContractorService,
    private premiumService: PremiumService,
    private supplierService: SupplierService,
    private categoryService: CategoryService,
    private warehouseService: WarehouseService,
    private labourExpenseService: LabourExpenseService,
    private employeeService: employeeService,
  ) {}

  /**
   * get purchaseOrder schema
   * @returns
   */
  async getSchema() {
    const purchaseSchemaObject = await purchaseOrderJsonSchema.PurchaseOrder;
    const purchaseSchema = JSON.parse(JSON.stringify(purchaseSchemaObject));
    purchaseSchema['title'] = purchaseSchema.title;
    purchaseSchema['type'] = purchaseSchema.type;
    purchaseSchema['properties']['_id'] = {
      type: 'string',
    };
    purchaseSchema['properties']['image'] = {
      type: 'string',
      format: 'data-url',
      title: 'Image',
    };

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
      supplierNameData.push(element.firstName);
    });
    purchaseSchema['properties']['supplierId']['enum'] = supplierIdData;
    purchaseSchema['properties']['supplierId']['enumNames'] = supplierNameData;

    /**
     * Get Category Enum Data
     */
    const categoryData = await this.categoryService.CategorywithsubCategory();
    purchaseSchema['properties']['categoryId']['type'] = 'string';
    purchaseSchema['properties']['categoryId']['selectValue'] = categoryData;

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
    purchaseSchema['properties']['storeId']['type'] = 'string';
    purchaseSchema['properties']['storeId']['selectValue'] =
      storeData[0]['data'];

    /**
     * Get Premium Enum data
     */
    const premiumData = await this.premiumService.getPremium({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const premiumIdData = [];
    const premiumNameData = [];
    const premiumValData = [];
    const premAllOff = [];
    premiumData[0]['data'].forEach((element) => {
      premiumIdData.push(element._id);
      premiumNameData.push(element.name);
      premiumValData.push(element.value);
      premAllOff.push({
        if: {
          properties: {
            premium: {
              const: element._id,
            },
          },
        },
        then: {
          properties: {
            premiumVal: {
              type: 'string',
              enum: [element.value.toString()],
            },
          },
          // required: ['food'],
        },
      });
    });
    purchaseSchema['properties']['premium']['enum'] = premiumIdData;
    purchaseSchema['properties']['premium']['enumNames'] = premiumNameData;
    purchaseSchema['properties']['premium']['value'] = premiumValData;

    // assign contractors to purchase order schema
    const labourExpenseSchema = await this.labourExpenseService.getSchema();

    purchaseSchema['properties']['deductions'] = {
      type: 'object',
      title: 'Deductions',
      properties: {
        bardana: purchaseSchema['properties']['bardana'],
        kanta: purchaseSchema['properties']['kanta'],
        sangli: purchaseSchema['properties']['sangli'],
        moisture: purchaseSchema['properties']['moisture'],
        other: purchaseSchema['properties']['other'],
      },
    };
    delete purchaseSchema['properties']['bardana'];
    delete purchaseSchema['properties']['kanta'];
    delete purchaseSchema['properties']['sangli'];
    delete purchaseSchema['properties']['moisture'];
    delete purchaseSchema['properties']['other'];

    // adding dependencies
    delete purchaseSchema['properties']['fixationStatus'];

    purchaseSchema['properties']['fixation'] = {
      type: 'object',
      title: 'Fixation',
      properties: {
        fixationStatus: {
          type: 'boolean',
          title: 'Fixation Status',
        },
      },
      dependencies: {
        fixationStatus: {
          oneOf: [
            {
              properties: {
                fixationStatus: {
                  enum: [true],
                },
                fixType: purchaseSchema['properties']['fixType'],
                pageRef: purchaseSchema['properties']['pageRef'],
                fixationDate: purchaseSchema['properties']['fixationDate'],
                rateType: purchaseSchema['properties']['rateType'],
                rate: purchaseSchema['properties']['rate'],
                premium: purchaseSchema['properties']['premium'],
                premiumVal: purchaseSchema['properties']['premiumVal'],

                tip: purchaseSchema['properties']['tip'],
              },
              allOf: premAllOff,
              // {
              //     required: ['premium'],
              //   },
              required: ['fixType', 'fixationDate', 'rateType', 'rate'],
            },
          ],
        },
      },
    };

    delete purchaseSchema['properties']['driverName'];

    /**
     * Get Contractor Enum data
     */
    const contractorData = await this.contractorService.getDriver();

    purchaseSchema['properties']['vehicleNumber']['selectValue'] =
      contractorData;

    /**
     * Get Employee Enum data
     */
    const employeeData = await this.employeeService.getemployee({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const employeeIdData = [''];
    const employeeNameData = [''];
    employeeData[0]['data'].forEach((element) => {
      employeeIdData.push(element['_id']);
      employeeNameData.push(element.fname + ' ' + element.lname);
    });
    purchaseSchema['properties']['uploaderClerk']['enum'] = employeeIdData;
    purchaseSchema['properties']['uploaderClerk']['enumNames'] =
      employeeNameData;
    purchaseSchema['properties']['downloaderClerk']['enum'] = employeeIdData;
    purchaseSchema['properties']['downloaderClerk']['enumNames'] =
      employeeNameData;

    delete purchaseSchema['properties']['fixType'];
    delete purchaseSchema['properties']['pageRef'];
    delete purchaseSchema['properties']['fixationDate'];
    delete purchaseSchema['properties']['rateType'];
    delete purchaseSchema['properties']['rate'];
    delete purchaseSchema['properties']['premium'];
    delete purchaseSchema['properties']['premiumVal'];
    delete purchaseSchema['properties']['tip'];
    purchaseSchema.properties.labourExpense = {
      type: 'array',
      title: 'Labour Expense',
      items: labourExpenseSchema.schema,
    };

    purchaseSchema['properties']['invoiceManual'] = {
      type: 'string',
      title: 'Manual Invoice',
    };
    // Bidirectional
    purchaseSchema.dependencies = {
      farmGross: ['farmTare'],
      farmTare: ['farmGross'],
    };
    purchaseSchema['properties']['fixation']['dependencies']['fixationStatus'][
      'dependencies'
    ] = {
      premium: ['premiumVal'],
    };

    purchaseSchema['properties']['detailNote'] = {
      type: 'object',
      title: 'Detailed Note',
      properties: {
        note: purchaseSchema['properties']['note'],
      },
    };
    delete purchaseSchema['properties']['note'];

    const customSchema = {
      schema: purchaseSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
        invoiceManual: { 'ui:widget': 'hidden' },
        categoryId: { 'ui:widget': 'myCustomCategoryTypeAhead' },
        supplierId: { 'ui:widget': 'myCustomSelectTypeAhead' },
        storeId: { 'ui:widget': 'myCustomStoreTypeAhead' },
        vehicleNumber: { 'ui:widget': 'myCustomVehicleTypeAhead' },
        uploaderClerk: { 'ui:widget': 'myCustomSelectTypeAhead' },
        downloaderClerk: { 'ui:widget': 'myCustomSelectTypeAhead' },
        image: { 'ui:widget': 'file' },
        purchaseDate: { 'ui:widget': 'date' },
        farmGross: { 'ui:widget': 'myCustomInputText' },
        farmTare: { 'ui:widget': 'myCustomInputText' },
        factoryGross: { 'ui:widget': 'myCustomInputText' },
        factoryTare: { 'ui:widget': 'myCustomInputText' },
        // purity: { 'ui:widget': 'myDatePickerBootstrap' },
        detailNote: {
          note: {
            'ui:widget': 'textarea',
            'ui:options': {
              rows: 7,
            },
          },
        },
        deductions: {
          bardana: { 'ui:widget': 'myCustomInputText' },
          kanta: { 'ui:widget': 'myCustomInputText' },
          sangli: { 'ui:widget': 'myCustomInputText' },
          moisture: { 'ui:widget': 'myCustomInputText' },
          other: { 'ui:widget': 'myCustomInputText' },
        },
        fixation: {
          fixType: { 'ui:widget': 'myFixationSelect' },
          rateType: { 'ui:widget': 'myFixationSelect' },
          fixationDate: { 'ui:widget': 'date' },
          rate: { 'ui:widget': 'myFixationInputText' },
          tip: { 'ui:widget': 'myFixationInputText' },
          premiumVal: { 'ui:widget': 'myPremiumSelect' },
        },
        labourExpense: {
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
        'ui:order': ['*', 'note'],
      },
    };
    return customSchema;
  }

  /**
   * get all purchaseOrder
   * @param pageOptionsDto
   * @returns
   */
  async getPurchaseOrder(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PurchaseOrder[]> {
    const schemaData = await purchaseOrderJsonSchema.PurchaseOrder;
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
    const queryBuilder = await this.purchaseOrderModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'labourexpenses',
            let: { purchaseId: '$_id' },
            pipeline: [
              {
                $match: {
                  $and: [
                    { isActive: true },
                    {
                      $expr: {
                        $eq: ['$assetId', '$$purchaseId'],
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  contractorID: 1,
                  contractorRateID: 1,
                  typeId: 1,
                },
              },
            ],
            as: 'labourExpense',
          },
        },
        // *************************
        {
          $lookup: {
            from: 'suppliers',
            localField: 'supplierId',
            foreignField: '_id',
            as: 'supplierData',
          },
        },
        {
          $unwind: {
            path: '$supplierData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'categoryData',
          },
        },
        {
          $unwind: {
            path: '$categoryData',
            preserveNullAndEmptyArrays: true,
          },
        },

        // *************************
        {
          $addFields: {
            invoiceManual: '$invoiceIdManual',
            rateType: { $ifNull: ['$rateType', ''] },
            fixType: { $ifNull: ['$fixType', ''] },
            premium: { $ifNull: ['$premium', ''] },
            premiumVal: { $ifNull: ['$premiumVal', ''] },
            rate: { $ifNull: ['$rate', ''] },
            pageRef: { $ifNull: ['$pageRef', ''] },
            date: { $ifNull: ['$date', ''] },

            totalAmount: { $ifNull: ['$totalAmount', ''] },
            paidAmount: { $ifNull: ['$paidAmount', ''] },
            conveyno: { $ifNull: ['$conveyno', ''] },
            storageSlipNo: { $ifNull: ['$storageSlipNo', ''] },
            detailNote: {
              $ifNull: [
                {
                  note: '$note',
                },
                '',
              ],
            },
            fixation: {
              $ifNull: [
                {
                  fixationDate: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$fixationDate',
                    },
                  },
                  fixationStatus: '$fixationStatus',
                  fixType: '$fixType',
                  pageRef: '$pageRef',
                  premium: '$premium',
                  premiumVal: '$premiumVal',
                  rate: '$rate',
                  rateType: '$rateType',
                  tip: '$tip',
                },
                '',
              ],
            },
            purchaseDate: {
              $dateToString: { format: '%Y-%m-%d', date: '$purchaseDate' },
            },
            deductions: {
              bardana: '$bardana',
              kanta: '$kanta',
              sangli: '$sangli',
              moisture: '$moisture',
              other: '$other',
            },

            // fixation: {
            //   fixationDate: 1,
            //   fixationStatus: 1,
            //   fixType: 1,
            //   pageRef: 1,
            //   premium: 1,
            //   premiumVal: 1,
            //   rate: 1,
            //   rateType: 1,
            //   tip: 1,
            // },
          },
        },
        {
          $lookup: {
            from: 'carriage_rates',
            let: { carriageRateId: '$carriageRateId' },
            pipeline: [
              {
                $match: { $expr: { $eq: ['$_id', '$$carriageRateId'] } },
              },
              {
                $lookup: {
                  from: 'farm_addresses',
                  localField: 'farmAddressId',
                  foreignField: '_id',
                  as: 'farmAddressInfo',
                },
              },
              {
                $unwind: {
                  path: '$carriageInfo',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
            as: 'carriageInfo',
          },
        },
        {
          $unwind: {
            path: '$carriageInfo',
            preserveNullAndEmptyArrays: true,
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
            total: { $arrayElemAt: ['$metadata.total', 0] },
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    // queryBuilder[0].data.forEach((element, index) => {
    //   queryBuilder[0].data[index]['deductions'] = {
    //     bardana: element['bardana'],
    //     kanta: element['kanta'],
    //     sangli: element['sangli'],
    //     moisture: element['moisture'],
    //     other: element['other'],
    //   };
    //   delete element['bardana'];
    //   delete element['kanta'];
    //   delete element['sangli'];
    //   delete element['moisture'];
    //   delete element['other'];
    // });
    return queryBuilder;
  }
  /**
   *
   * get single PurchaseOrder
   * @param id
   * @returns
   */
  async findById(id: string): Promise<PurchaseOrder[]> {
    const queryBuilder = await this.purchaseOrderModel
      .aggregate([
        {
          $match: {
            isActive: true,
            _id: new Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'suppliers',
            localField: 'supplierId',
            foreignField: '_id',
            as: 'supplier',
          },
        },
        { $unwind: { path: '$supplier', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'stores',
            localField: 'storeId',
            foreignField: '_id',
            as: 'store',
          },
        },
        { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'contractor_rates',
            let: { uploaderRate: '$uploaderRate' },
            pipeline: [
              {
                $match: { $expr: { $eq: ['$_id', '$$uploaderRate'] } },
              },
              {
                $lookup: {
                  from: 'contractors',
                  localField: 'contractorId',
                  foreignField: '_id',
                  as: 'uploaderName',
                },
              },
              {
                $unwind: {
                  path: '$uploaderName',
                  preserveNullAndEmptyArrays: true,
                },
              },
              // {$project: {_id: 1, username: 1, office: 1}},
            ],
            as: 'uploaderInfo',
          },
        },
        {
          $unwind: {
            path: '$uploaderInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'contractor_rates',
            let: { downloaderRate: '$downloaderRate' },
            pipeline: [
              {
                $match: { $expr: { $eq: ['$_id', '$$downloaderRate'] } },
              },
              {
                $lookup: {
                  from: 'contractors',
                  localField: 'contractorId',
                  foreignField: '_id',
                  as: 'downloaderName',
                },
              },
              {
                $unwind: {
                  path: '$downloaderName',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
            as: 'downloaderInfo',
          },
        },
        {
          $unwind: {
            path: '$downloaderInfo',
            preserveNullAndEmptyArrays: true,
          },
        },

        //carriage rate lookup
        {
          $lookup: {
            from: 'carriage_rates',
            let: { carriageRateId: '$carriageRateId' },
            pipeline: [
              {
                $match: { $expr: { $eq: ['$_id', '$$carriageRateId'] } },
              },
              {
                $lookup: {
                  from: 'farm_addresses',
                  localField: 'farmAddressId',
                  foreignField: '_id',
                  as: 'farmAddressInfo',
                },
              },
              {
                $unwind: {
                  path: '$carriageInfo',
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
            as: 'carriageInfo',
          },
        },
        {
          $unwind: {
            path: '$carriageInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
      ])
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async validatePurchase(createDto: any): Promise<PurchaseOrder> {
    if (
      createDto.farmGross < createDto.farmTare &&
      createDto.factoryGross < createDto.farmTare
    ) {
      throw new HttpException(
        ResponseMessage.FarmGross_FACTORYGROOS_Error,
        ResponseCode.BAD_REQUEST,
      );
    }
    if (
      createDto.uploaderBag != createDto.downloaderBag &&
      createDto.uploaderBag != createDto.carriageBag
    ) {
      createDto.suspect = true;
    }
    //calculation
    if (createDto.fixation) {
      let weight = 0;
      if (createDto.fixation.fixType == 'factory') {
        weight =
          createDto.factoryGross -
          createDto.factoryTare -
          (createDto['deductions'].bardana ||
            0 + createDto['deductions'].kanta ||
            0 + createDto['deductions'].sangli ||
            0 + createDto['deductions'].moisture ||
            0 + createDto['deductions'].other ||
            0);
      } else if (createDto.fixation.fixType == 'farm') {
        weight =
          createDto.farmGross -
          createDto.farmTare -
          (createDto['deductions'].bardana ||
            0 + createDto['deductions'].kanta ||
            0 + createDto['deductions'].sangli ||
            0 + createDto['deductions'].moisture ||
            0 + createDto['deductions'].other ||
            0);
      }
      if (weight > 0) {
        if (createDto.fixation.rateType == 'mund') {
          createDto.totalAmount = weight * (createDto.fixation.rate / 40);
        } else if (createDto.fixation.rateType == 'kg') {
          createDto.totalAmount = weight * createDto.fixation.rate;
        }
      }
      if (createDto.fixation.premium) {
        const premiumData: any = await this.premiumService.getPremiumById(
          createDto.fixation.premium,
        );
        if (premiumData) {
          const premiumValue = (premiumData.value / 40) * weight;
          createDto.totalAmount = createDto.totalAmount - premiumValue;
        }
      }
    }

    return createDto;
  }
  /**
   * post
   * @param createDto
   * @returns
   */
  async create(createDto: PurchaseOrder): Promise<PurchaseOrderDocument> {
    let createObj: PurchaseOrder = await this.validatePurchase(createDto);
    createObj = {
      ...createObj,
      ...createObj['fixation'],
      ...createObj['deductions'],
      ...createObj['detailNote'],
    };
    //createObj.premiumVal = parseFloat(createObj.premiumVal);
    const create: PurchaseOrderDocument = new this.purchaseOrderModel(
      createObj,
    );
    let savedItem;
    try {
      savedItem = await create.save();
      const labourExpArray: LabourExpense[] = createDto['labourExpense'].map(
        (item) => {
          item.assetId = savedItem._doc._id.toString();
          return item;
        },
      );
      await this.labourExpenseService.create(labourExpArray);
      // for (let i = 0; i < labourExpArray.length; i++) {
      //   await this.labourExpenseService.create(labourExpArray[i]);
      // }
    } catch (error) {
      throw new HttpException(error.message, ResponseCode.BAD_REQUEST);
    }
    return savedItem;
  }

  /**
   *
   * patch
   * @param id & purchaseOrder object
   * @return
   */
  async update(
    id: string,
    purchaseOrderData: any,
  ): Promise<PurchaseOrderDocument> {
    const createObj = await this.validatePurchase(purchaseOrderData);
    const up = await this.purchaseOrderModel
      .findByIdAndUpdate({ _id: id }, createObj)
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });

    const ids = purchaseOrderData['labourExpense'].map((item) => {
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

    purchaseOrderData['labourExpense'].forEach(async (item) => {
      if (item._id) {
        await this.labourExpenseService.update(item._id, item).catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
      } else {
        item.assetId = id;
        await this.labourExpenseService.create(item).catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
      }
    });

    return up;
  }

  /**
   *
   * delete
   * @param id
   * @return
   */
  async delete(id: string): Promise<any> {
    const existingExpense =
      await this.labourExpenseService.getlabourExpenseByFK(id);
    existingExpense.forEach(async (item) => {
      await this.labourExpenseService.delete(item['_id']);
    });
    await this.purchaseOrderModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    await this.labourExpenseService.deleteMany(id);
    return;
  }
}
