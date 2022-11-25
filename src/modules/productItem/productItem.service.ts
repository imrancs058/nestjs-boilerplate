import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  productItemJsonSchema,
  ProductItem,
  ProductItemDocument,
} from './productItem.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { ProductItemDto } from './dto/productItem.dto';

@Injectable()
export class ProductItemService {
  constructor(
    @InjectModel(ProductItem.name)
    private productItemModel: Model<ProductItem>,
  ) {}

  /**
   * get product Item schema
   * @returns
   */
  async getSchema() {
    const productSchema = await productItemJsonSchema.ProductItem;
    productSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: productSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all productItem
   * @param pageOptionsDto
   * @returns
   */

  async getProductItem(pageOptionsDto: PageOptionsDto): Promise<ProductItem[]> {
    const queryBuilder = await this.productItemModel
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
   * get single ProductItem
   * @param id
   * @returns
   */
  async findById(id: string): Promise<ProductItem[]> {
    const queryBuilder = await this.productItemModel
      .find({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async findOneById(id: string): Promise<ProductItem> {
    const queryBuilder = await this.productItemModel
      .findOne({ $and: [{ _id: id }, { isActive: true }] })
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
  async create(createDto: ProductItem): Promise<ProductItemDocument> {
    const create: ProductItemDocument = new this.productItemModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & store object
   * @return
   */
  async update(
    id: string,
    productItemData: ProductItemDto,
  ): Promise<ProductItemDocument> {
    return await this.productItemModel
      .findByIdAndUpdate({ _id: id }, productItemData)
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
    return await this.productItemModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
