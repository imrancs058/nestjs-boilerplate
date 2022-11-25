import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseCode } from '../../exceptions';
import {
  MailConfigration,
  MailConfigrationDocument,
  mailConfigrationJsonSchema,
} from './mail-configration.schema';

@Injectable()
export class MailConfigrationService {
  constructor(
    @InjectModel(MailConfigration.name)
    private mailConfigrationModel: Model<MailConfigrationDocument>,
  ) {}
  /**
   * get all MailConfigration
   * @param pageOptionsDto
   * @returns
   */

  async getMailConfigration(): Promise<MailConfigration> {
    const queryBuilder = await this.mailConfigrationModel
      .findOne({ isActive: true })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }
  /**
   *
   * get single role
   * @param id
   * @returns
   */
  async findById(id: string): Promise<MailConfigration[]> {
    const queryBuilder = await this.mailConfigrationModel
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
  async create(createDto: MailConfigration): Promise<MailConfigrationDocument> {
    const create: MailConfigrationDocument = new this.mailConfigrationModel(
      createDto,
    );
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }
  /**
   *
   * patch
   * @param id & roleData object
   * @return
   */
  async update(
    id: string,
    roleData: Partial<MailConfigration>,
  ): Promise<MailConfigrationDocument> {
    return await this.mailConfigrationModel
      .findByIdAndUpdate({ _id: id }, roleData)
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
    return await this.mailConfigrationModel
      .updateOne({ _id: id }, { isActive: false })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
  }
  /**
   * get company schema
   * @returns
   */
  async getSchema() {
    const schema = await mailConfigrationJsonSchema.MailConfigration;
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
}
