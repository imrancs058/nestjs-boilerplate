import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  contractor_rateJsonSchema,
  Contractor_Rate,
  Contractor_RateDocument,
} from './contractor_rate.schema';
import { ResponseCode, ResponseMessage } from '../../exceptions/index';
import { Contractor_RateDto } from './dto/contractor_rate.dto';

@Injectable()
export class ContractorRateService {
  constructor(
    @InjectModel(Contractor_Rate.name)
    private contractor_rateModel: Model<Contractor_RateDocument>,
  ) {}

  /**
   * get contractor_rate schema
   * @returns
   */
  async getSchema() {
    const schema = await contractor_rateJsonSchema.Contractor_Rate;
    schema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: schema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }

  /**
   *
   * get single contractor rate
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Contractor_Rate[]> {
    const queryBuilder = await this.contractor_rateModel
      .aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id),
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
          $lookup: {
            from: 'contractors',
            localField: 'contractorId',
            foreignField: '_id',
            as: 'contractor_doc',
          },
        },
        {
          $unwind: {
            path: '$contractor_doc',
            preserveNullAndEmptyArrays: true,
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
   * get array of  contractor rate
   * @param Array(id)
   * @returns
   */
  async findByArrayId(id: Types.ObjectId[]): Promise<number> {
    const contractorArray = await this.contractor_rateModel
      .find({ _id: id })
      .distinct('packingSize')
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    if (contractorArray.length > 1) {
      throw new HttpException(
        ResponseMessage.CONTRACTOR_PACKING_SIZE_ERROR,
        ResponseCode.BAD_REQUEST,
      );
    }
    return contractorArray[0];
  }

  /**
   * post
   * @param createDto
   * @returns
   */
  async create(createDto: Contractor_Rate): Promise<Contractor_RateDocument> {
    const create: Contractor_RateDocument = new this.contractor_rateModel(
      createDto,
    );
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }

  /**
   *
   * patch
   * @param id & contractorRateData object
   * @return
   */
  async update(
    id: string,
    contractorRateData: Contractor_RateDto,
  ): Promise<Contractor_RateDocument> {
    return await this.contractor_rateModel
      .findByIdAndUpdate({ _id: id }, contractorRateData)
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
    return await this.contractor_rateModel
      .updateOne({ _id: id }, { isActive: false })
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
  async deleteMany(id: string): Promise<any> {
    return await this.contractor_rateModel
      .updateMany({ contractorId: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
}
