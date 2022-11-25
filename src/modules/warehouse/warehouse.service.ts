/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  warehouseJsonSchema,
  Warehouse,
  WarehouseDocument,
} from './warehouse.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions/index';
import { StoreService } from '../store/store.service';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectModel(Warehouse.name)
    private warehouseModel: Model<WarehouseDocument>,
    private storeService: StoreService,
  ) {}

  /**
   * get warehouse schema
   * @returns
   */
  async getSchema() {
    const warehouse = warehouseJsonSchema.Warehouse;
    warehouse['properties']['_id'] = {
      type: 'string',
    };
    const storeSchema = await this.storeService.getSchema();

    const store = {};
    store['type'] = 'object';
    store['required'] = storeSchema.schema.required;
    store['properties'] = {};
    if (storeSchema?.schema?.properties?.warehouseId) {
      store['properties']['warehouseId'] =
        storeSchema.schema.properties.warehouseId;
    }
    let chatha = JSON.stringify(store);
    chatha = JSON.parse(chatha);

    /**
     * Get warehouse enum data
     */
    const warehouseData = await this.getWarehouseWithStore({
      column: '_id',
      order: 1,
      take: 1000,
      skip: 0,
    });
    const contif = [];
    const warehouseListEnum = [];
    const warehouseListEnumName = [];
    warehouseData[0]['data'].forEach((item) => {
      const contEnum = [];
      const contEnumName = [];
      warehouseListEnum.push(item['_id']);
      warehouseListEnumName.push(item['name']);
      item['childrens'].forEach((val) => {
        contEnum.push(val._id);
        contEnumName.push(val.name);
      });

      contif.push({
        if: {
          properties: {
            warehouseId: {
              const: item['_id'],
            },
          },
        },
        then: {
          properties: {
            storeId: {
              type: 'string',
              enum: contEnum.length == 0 ? [''] : contEnum,
              enumNames: contEnumName.length == 0 ? [''] : contEnumName,
            },
          },
          required: ['storeId'],
        },
      });
    });
    const warehouseEnum = {
      enum: warehouseListEnum,
      enumNames: warehouseListEnumName,
      title: 'Warehouse',
    };
    store['properties']['warehouseId'] = warehouseEnum;
    chatha['properties']['warehouseId'] = warehouseEnum;
    chatha['properties']['storeId'] = {
      type: 'string',
      title: 'Store',
    };
    chatha['allOf'] = contif;

    if (storeSchema?.schema?.properties?.name) {
      store['properties']['name'] = storeSchema.schema.properties.name;
      chatha['properties']['name'] = storeSchema.schema.properties.name;
    }
    if (storeSchema?.schema?.properties?.direction) {
      store['properties']['direction'] =
        storeSchema.schema.properties.direction;
      store['properties']['_id'] = {
        type: 'string',
      };
      chatha['properties']['direction'] =
        storeSchema.schema.properties.direction;
      chatha['properties']['_id'] = {
        type: 'string',
      };
    }

    const warehouseSchema = {};
    warehouseSchema['title'] = warehouse.title;
    warehouseSchema['type'] = warehouse.type;
    const radioBtns = {
      type: {
        type: 'string',
        title: 'Warehouse Type',
        enum: ['Warehouse', 'Store', 'Chatha'],
      },
    };
    warehouseSchema['properties'] = radioBtns;
    warehouseSchema['dependencies'] = {
      type: {
        oneOf: [
          {
            properties: {
              type: {
                enum: ['Warehouse'],
              },
              Warehouse: warehouse,
            },
          },
          {
            properties: {
              type: {
                enum: ['Store'],
              },
              Store: store,
            },
          },
          {
            properties: {
              type: {
                enum: ['Chatha'],
              },
              Chatha: chatha,
            },
          },
        ],
      },
    };
    const tableDataCol = [
      { title: 'Name', name: 'name' },
      { title: 'Address', name: 'address' },
      { title: 'Store', name: 'storeName' },
      { title: 'StoreDirection', name: 'storeDirection' },
      { title: 'ChathaName', name: 'chathaName' },
      { title: 'ChathaDirection', name: 'chathaDirection' },
      { title: 'ChathaOccupy', name: 'chathaOccupy' },
    ];
    const customSchema = {
      schema: warehouseSchema,
      uischema: {
        type: {
          'ui:widget': 'radio',
          'ui:options': {
            inline: true,
          },
        },
        Warehouse: {
          _id: { 'ui:widget': 'hidden' },
        },
        Store: {
          warehouseId: { 'ui:widget': 'myCustomSelectTypeAhead' },
          _id: { 'ui:widget': 'hidden' },
        },
        Chatha: {
          warehouseId: { 'ui:widget': 'myCustomSelectTypeAhead' },
          storeId: { 'ui:widget': 'myCustomSelectTypeAhead' },
          _id: { 'ui:widget': 'hidden' },
        },
      },
      extraColumn: tableDataCol,
    };
    return customSchema;
  }

  /**
   * get all warehouse
   * @param pageOptionsDto
   * @returns
   */
  async getWarehouse(pageOptionsDto: PageOptionsDto): Promise<any[]> {
    const schemaKeys = [
      '_id',
      'name',
      'storeName',
      'address',
      'type',
      'storeDirection',
      'storeOccupy',
      'chathaName',
      'chathaDirection',
      'chathaOccupy',
    ];
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
    const queryBuilder = await this.warehouseModel
      .aggregate([
        {
          $match: {
            isActive: true,
          },
        },
        {
          $lookup: {
            from: 'stores',
            let: { store: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$warehouseId', '$$store'] } } },
              {
                $graphLookup: {
                  from: 'stores',
                  startWith: '$_id',
                  connectFromField: '_id',
                  connectToField: 'storeId',
                  maxDepth: 0,
                  as: 'Chatha',
                  restrictSearchWithMatch: { isActive: true },
                },
              },
              {
                $unwind: {
                  path: '$Chatha',
                  preserveNullAndEmptyArrays: true,
                },
              },
              // {$project: {_id: 1, username: 1, office: 1}},
            ],
            as: 'Store',
          },
        },
        {
          $unwind: {
            path: '$Store',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            Chatha: '$Store.Chatha',
            Store: 1,
            Warehouse: {
              _id: '$_id',
              name: '$name',
              address: '$address',
            },
            address: 1,
            storeName: { $ifNull: ['$Store.name', ''] },
            storeDirection: { $ifNull: ['$Store.direction', ''] },
            storeOccupy: { $ifNull: ['$Store.isOccupy', ''] },
            chathaName: { $ifNull: ['$Store.Chatha.name', ''] },
            chathaDirection: { $ifNull: ['$Store.Chatha.direction', ''] },
            chathaOccupy: { $ifNull: ['$Store.Chatha.isOccupy', ''] },
            type: {
              $cond: [
                { $eq: [{ $ifNull: ['$Store.name', null] }, null] },
                'Warehouse',
                {
                  $cond: [
                    { $eq: [{ $ifNull: ['$Store.Chatha.name', null] }, null] },
                    'Store',
                    'Chatha',
                  ],
                },
              ],
            },
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            isActive: 1,
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
   * get all warehouse with stores
   * @param pageOptionsDto
   * @returns
   */
  async getWarehouseWithStore(
    pageOptionsDto: PageOptionsDto,
  ): Promise<Warehouse[]> {
    const queryBuilder = await this.warehouseModel
      .aggregate([
        {
          $match: { isActive: true },
        },
        {
          $lookup: {
            from: 'stores',
            let: { id: '$_id' },
            pipeline: [
              {
                $match: {
                  $and: [
                    { $expr: { $eq: ['$warehouseId', '$$id'] } },
                    { storeId: null },
                  ],
                },
              },
            ],
            as: 'childrens',
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
  async findById(id: string): Promise<Warehouse[]> {
    const queryBuilder = await this.warehouseModel
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
  async create(createDto: Partial<Warehouse>): Promise<WarehouseDocument> {
    if (createDto['type'] === 'Warehouse') {
      const warehouseData = {
        name: createDto['Warehouse']['name'],
        address: createDto['Warehouse']['address'],
      };
      const create: WarehouseDocument = new this.warehouseModel(warehouseData);
      return await create.save().catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    } else if (createDto['type'] === 'Store') {
      const storeData = {
        name: createDto['Store']['name'],
        direction: createDto['Store']['direction'],
        warehouseId: createDto['Store']['warehouseId'],
      };
      await this.storeService.create(storeData);
      return;
    } else if (createDto['type'] === 'Chatha') {
      const chathaData = {
        name: createDto['Chatha']['name'],
        direction: createDto['Chatha']['direction'],
        warehouseId: createDto['Chatha']['warehouseId'],
        storeId: createDto['Chatha']['storeId'],
      };
      await this.storeService.create(chathaData);
      return;
    }
  }

  /**
   *
   * patch
   * @param id & warehouseData object
   * @return
   */
  async update(
    id: string,
    warehouseData: Partial<Warehouse>,
  ): Promise<WarehouseDocument> {
    if (warehouseData['type'] === 'Warehouse') {
      const data = {
        name: warehouseData['Warehouse']['name'],
        address: warehouseData['Warehouse']['address'],
      };
      return await this.warehouseModel
        .findByIdAndUpdate(warehouseData['Warehouse']['_id'], data)
        .catch((err) => {
          throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
        });
    } else if (warehouseData['type'] === 'Store') {
      const storeData = {
        name: warehouseData['Store']['name'],
        direction: warehouseData['Store']['direction'],
        warehouseId: warehouseData['Store']['warehouseId'],
      };
      await this.storeService.update(warehouseData['Store']['_id'], storeData);
      return;
    } else if (warehouseData['type'] === 'Chatha') {
      const chathaData = {
        name: warehouseData['Chatha']['name'],
        direction: warehouseData['Chatha']['direction'],
        warehouseId: warehouseData['Chatha']['warehouseId'],
        storeId: warehouseData['Chatha']['storeId'],
      };
      await this.storeService.update(
        warehouseData['Chatha']['_id'],
        chathaData,
      );
      return;
    }
  }

  /**
   *
   * delete
   * @param id
   * @return
   */
  async delete(id: string): Promise<any> {
    await this.warehouseModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    await this.storeService.deleteMany(id);
    return;
  }
}
