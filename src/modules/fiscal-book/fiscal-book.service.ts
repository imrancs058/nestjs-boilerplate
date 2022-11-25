import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseCode } from '../../exceptions';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { FiscalBook, FiscalBookDocument } from './fiscal-book.schema';

@Injectable()
export class FiscalBookService {
  constructor(
    @InjectModel(FiscalBook.name)
    private fiscalBookModel: Model<FiscalBookDocument>,
  ) {}
  /**
   * get all roll
   * @param pageOptionsDto
   * @returns
   */

  async getFiscalBook(pageOptionsDto: PageOptionsDto): Promise<FiscalBook[]> {
    const queryBuilder = await this.fiscalBookModel
      .aggregate([
        {
          $match: {
            isActive: true,
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
   * get single FiscalBook
   * @param id
   * @returns
   */
  async findById(id: string): Promise<FiscalBook[]> {
    const queryBuilder = await this.fiscalBookModel
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
  async create(createDto: FiscalBook): Promise<FiscalBookDocument> {
    const create: FiscalBookDocument = new this.fiscalBookModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }
  /**
   *
   * patch
   * @param id & FiscalBookData object
   * @return
   */
  async update(
    id: string,
    fiscalBookData: Partial<FiscalBook>,
  ): Promise<FiscalBookDocument> {
    return await this.fiscalBookModel
      .findByIdAndUpdate({ _id: id }, fiscalBookData)
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
    return await this.fiscalBookModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
