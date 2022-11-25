/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { paymentJsonSchema,Payment, PaymentDocument } from './payment.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { PaymentDtoDto } from './dto/paymentDto.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: Model<Payment>,
  ) {}

    /**
   * get payment schema
   * @returns
   */
     async getSchema(){
      const paymentSchema= await paymentJsonSchema.Payment
      paymentSchema['properties']['_id'] = {
        type: 'string',
      };
      const customSchema = {
        schema: paymentSchema,
        uischema: {
          _id: { 'ui:widget': 'hidden' },
        },
      };
      return customSchema;
    }


  /**
   * get all payment
   * @param pageOptionsDto
   * @returns
   */

  async getPayment(pageOptionsDto: PageOptionsDto): Promise<Payment[]> {
    const queryBuilder = await this.paymentModel
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
   * get single Payment
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Payment[]> {
    const queryBuilder = await this.paymentModel
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
  async create(createDto: Payment): Promise<PaymentDocument> {
    const create: PaymentDocument = new this.paymentModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & payment object
   * @return
   */
  async update(
    id: string,
    paymentData: PaymentDtoDto,
  ): Promise<PaymentDocument> {
    return await this.paymentModel
      .findByIdAndUpdate({ _id: id }, paymentData)
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
    return await this.paymentModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
