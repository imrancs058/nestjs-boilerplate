/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { customerJsonSchema,Customer, CustomerDocument } from './customer.schema';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ResponseCode } from '../../exceptions';
import { CustomerDtoDto } from './dto/customerDto.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private customerModel: Model<Customer>,
  ) {}

    /**
   * get Customer schema
   * @returns
   */
     async getSchema(){
      const customerSchema= await customerJsonSchema.Customer
      customerSchema['properties']['_id'] = {
        type: 'string',
      };
      const customSchema = {
        schema: customerSchema,
        uischema: {
          _id: { 'ui:widget': 'hidden' },
        },
      };
      return customSchema;
    }


  /**
   * get all customer
   * @param pageOptionsDto
   * @returns
   */

  async getCustomer(pageOptionsDto: PageOptionsDto): Promise<Customer[]> {
    const queryBuilder = await this.customerModel
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
   * get single Customer
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Customer[]> {
    const queryBuilder = await this.customerModel
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
  async create(createDto: Customer): Promise<CustomerDocument> {
    const create: CustomerDocument = new this.customerModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & customer object
   * @return
   */
  async update(
    id: string,
    customerData: CustomerDtoDto,
  ): Promise<CustomerDocument> {
    return await this.customerModel
      .findByIdAndUpdate({ _id: id }, customerData)
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
    return await this.customerModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
