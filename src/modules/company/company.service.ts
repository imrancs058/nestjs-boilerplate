import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseCode } from '../../exceptions';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { Company, CompanyDocument, companyJsonSchema } from './company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,
  ) {}
  /**
   * get all roll
   * @param pageOptionsDto
   * @returns
   */

  async getCompanyData(pageOptionsDto: PageOptionsDto): Promise<Company> {
    const queryBuilder = await this.companyModel
      .findOne({ isActive: true })
      .catch((err) => {
        throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
      });
    return queryBuilder;
  }
  /**
   *
   * get single companyData
   * @param id
   * @returns
   */
  async findById(id: string): Promise<Company[]> {
    const queryBuilder = await this.companyModel
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
  async create(createDto: Company): Promise<CompanyDocument> {
    const create: CompanyDocument = new this.companyModel(createDto);
    return await create.save().catch((err) => {
      throw new HttpException(err.message, ResponseCode.BAD_REQUEST);
    });
  }
  /**
   *
   * patch
   * @param id & CompanyData object
   * @return
   */
  async update(
    id: string,
    companyData: Partial<Company>,
  ): Promise<CompanyDocument> {
    return await this.companyModel
      .findByIdAndUpdate({ _id: id }, companyData)
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
    return await this.companyModel
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
    const companySchema = await companyJsonSchema.Company;
    companySchema['properties']['_id'] = {
      type: 'string',
    };
    const customSchema = {
      schema: companySchema,
      uischema: {
        _id: { 'ui:widget': 'hidden' },
      },
    };
    return customSchema;
  }
}
