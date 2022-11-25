import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { bookJsonSchema, BookItem, BookItemDocument } from './bookItem.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { BookItemDtoDto } from './dto/bookItemDto.dto';

@Injectable()
export class BookItemService {
  constructor(
    @InjectModel(BookItem.name)
    private bookItemModel: Model<BookItem>,
  ) {}

  /**
   * get bookI Item schema
   * @returns
   */
  async getSchema() {
    const bookItemSchema = await bookJsonSchema.BookItem;
    bookItemSchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: bookItemSchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   * get all bookItem
   * @param pageOptionsDto
   * @returns
   */

  async getBookItem(pageOptionsDto: PageOptionsDto): Promise<BookItem[]> {
    const queryBuilder = await this.bookItemModel
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
   * get single BookItem
   * @param id
   * @returns
   */
  async findById(id: string): Promise<BookItem[]> {
    const queryBuilder = await this.bookItemModel
      .find({ $and: [{ _id: id }, { isActive: true }] })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }

  async findOneById(id: string): Promise<BookItem> {
    const queryBuilder = await this.bookItemModel
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
  async create(createDto: BookItem): Promise<BookItemDocument> {
    const create: BookItemDocument = new this.bookItemModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & bookItem object
   * @return
   */
  async update(
    id: string,
    bookItemData: BookItemDtoDto,
  ): Promise<BookItemDocument> {
    return await this.bookItemModel
      .findByIdAndUpdate({ _id: id }, bookItemData)
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
    return await this.bookItemModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
